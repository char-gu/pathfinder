import pygame
import math
from queue import PriorityQueue

WIDTH = 800
WIN = pygame.display.set_mode((WIDTH, WIDTH)) #grid will be a square of 800x800
pygame.display.set_caption("Path Finding Algorithm")

#(R, G, B) - GRID traversal and obstacles will be indicated by their color
RED = (255, 0, 0) #visited nodes
GREEN = (0, 255, 0) #start node
TEAL = (0, 255, 255) #visitable nodes
PINK = (255, 102, 255) #end node
BLUE = (0, 0, 255) #path
WHITE = (255, 255, 255) #initial state - not yet visited
BLACK = (0, 0, 0) #barrier node
GREY = (128, 128, 128)

class Node:
    def __init__(self, row, col, width, totalrows):
        self.row = row
        self.col = col
        self.x = row * width #row multiplied by width of each little cube
        self.y = col * width #same for col
        self.color = WHITE
        self.neighbors = []
        self.width = width
        self.totalrows = totalrows

    def get_pos(self):
        return self.row, self.col

    def visited(self):
        return self.color == RED

    def visitable(self):
        return self.color == TEAL

    def is_blocked(self):
        return self.color == BLACK
    
    def is_start(self):
        return self.color == BLUE
    
    def is_end(self):
        return self.color == PINK
    
    def reset(self):
        self.color = WHITE

    def make_visited(self):
        self.color = RED

    def make_visitable(self):
        self.color = TEAL
        
    def make_blocked(self):
        self.color = BLACK
    
    def make_start(self):
        self.color = BLUE
    
    def make_end(self):
        self.color = PINK

    def make_path(self):
        self.color = GREEN

    def draw(self, win):
        pygame.draw.rect(win, self.color, (self.x, self.y, self.width, self.width))

    def update_neighbors(self, grid):
        self.neighbors = []
        if self.row < self.totalrows - 1 and not grid[self.row + 1][self.col].is_blocked(): #underneath node
            self.neighbors.append(grid[self.row + 1][self.col])

        if self.row > 0 and not grid[self.row - 1][self.col].is_blocked(): #top node
            self.neighbors.append(grid[self.row - 1][self.col])

        if self.col < self.totalrows - 1 and not grid[self.row][self.col + 1].is_blocked(): #right node
            self.neighbors.append(grid[self.row][self.col + 1])

        if self.col > 0 and not grid[self.row][self.col - 1].is_blocked(): #left node
            self.neighbors.append(grid[self.row][self.col - 1])

    def __lt__(self, other):
        return False

def h(p1, p2): #heuristic function estimating Manhattan distance from current node to end node
    x1, y1 = p1
    x2, y2 = p2
    return abs(x1 - x2) + abs(y1 - y2)

def reconstruct_path(prev_node, current, draw):
    while current in prev_node:
        current = prev_node[current]
        current.make_path()
        draw()


def algorithm(draw, grid, start, end):
    #draw = Lambda: print("Hello")
    count = 0
    open_set = PriorityQueue()
    open_set.put((0, count, start))
    prev_node = {}
    g_score = {node: float("inf") for row in grid for node in row}
    g_score[start] = 0
    f_score = {node: float("inf") for row in grid for node in row}
    f_score[start] = h(start.get_pos(), end.get_pos())

    open_set_hash = {start}

    while not open_set.empty():
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
        
        current = open_set.get()[2]
        open_set_hash.remove(current)

        if current == end:
            reconstruct_path(prev_node, end, draw)
            end.make_end()
            return True
        
        for neighbor in current.neighbors:
            temp_g_score = g_score[current] + 1

            if temp_g_score < g_score[neighbor]:
                prev_node[neighbor] = current
                g_score[neighbor] = temp_g_score
                f_score[neighbor] = temp_g_score + h(neighbor.get_pos(), end.get_pos())
                if neighbor not in open_set_hash:
                    count += 1
                    open_set.put((f_score[neighbor], count, neighbor))
                    open_set_hash.add(neighbor)
                    neighbor.make_visitable()

        draw()
        
        if current != start:
            current.make_visited()

    return False

def make_grid(rows, width):
    grid = []
    nodewidth = width // rows
    for i in range(rows):
        grid.append([])
        for j in range(rows):
            node = Node(i, j, nodewidth, rows)
            grid[i].append(node)
    return grid

def draw_gridlines(win, rows, width):
    nodewidth = width // rows
    for i in range(rows):
        pygame.draw.line(win, GREY, (0, i * nodewidth), (width, i * nodewidth))
        for j in range(rows):
            pygame.draw.line(win, GREY, (j * nodewidth, 0), (j * nodewidth, width))

def draw(win, grid, rows, width):
    win.fill(WHITE)
    #fill window with default, then fill it up with each nodes respective color
    for row in grid:
        for node in row:
            node.draw(win)
    #now we draw the gridlines
    draw_gridlines(win, rows, width)
    pygame.display.update() #take whatever we just drew and update it on the display
    
def get_click_pos(pos, rows, width):
    nodewidth = width // rows
    y, x = pos
    row = y // nodewidth
    col = x // nodewidth

    return row, col

def main(win, width):
    ROWS = 50
    grid = make_grid(ROWS, width)

    start = None
    end = None

    running = True #running main loop or not
    started = False #have we started the algorithm or not
    while running:
        draw(win, grid, ROWS, width)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            #if started:
                #continue
            
            if pygame.mouse.get_pressed()[0]: #left click button
                pos = pygame.mouse.get_pos() #gets x, y coordinates of pygame mouse on screen
                row, col = get_click_pos(pos, ROWS, width)
                node = grid[row][col]
                if not start and node != end:
                    start = node
                    start.make_start()
                
                elif not end and node != start:
                    end = node
                    end.make_end()
                
                elif node != start and node != end:
                    node.make_blocked()

            elif pygame.mouse.get_pressed()[2]: #right click button
                pos = pygame.mouse.get_pos()
                row, col = get_click_pos(pos, ROWS, width)
                node = grid[row][col]
                node.reset()
                if node == start:
                    start = None
                elif node == end:
                    end = None
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and start and end:
                    for row in grid:
                        for node in row:
                            node.update_neighbors(grid)
    
                    algorithm(lambda: draw(win, grid, ROWS, width), grid, start, end)

                if event.key == pygame.K_c:
                    start = None
                    end = None
                    grid = make_grid(ROWS, width)
    pygame.quit()

main(WIN, WIDTH )
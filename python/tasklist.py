import random

class Task:
    def __init__(self, task):
        if str(task.__annotations__["return"]) == "<class 'bool'>":
            self.task = task
        else:
            raise Exception("Task function must have a return annotation of type bool")
        self.initialized = True

    def __init__(self, init, task):
        if str(init.__annotations__["return"]) == "<class 'bool'>":
            self.init = init
        else:
            raise Exception("Init function must have a return annotation of type bool")
        if str(task.__annotations__["return"]) == "<class 'bool'>":
            self.task = task
        else:
            raise Exception("Task function must have a return annotation of type bool")
        self.initialized = False

    def execute(self):
        if not self.initialized:
            self.init()
            self.initialized = True
        result = self.task()
        return result

class TaskList:
    def __init__(self):
        self.tasks = []

    def __init__(self, *tasks):
        self.tasks = []
        for task in tasks:
            self.tasks.append(task)

    def add(self, *tasks):
        for task in tasks:
            if isinstance(task, Task) or isinstance(task, TaskList) or isinstance(task, ParallelTask):
                self.tasks.append(task)

    def execute(self):
        task = self.tasks[0]
        if task.execute():
            self.tasks.pop(0)
        if len(self.tasks) == 0:
            return True

    def isDone(self):
        return len(self.tasks) == 0

class ParallelTask:
    def __init__(self):
        self.tasks = []

    def __init__(self, *tasks):
        self.tasks = []
        for task in tasks:
            self.tasks.append(task)

    def add(self, *tasks):
        for task in tasks:
            if isinstance(task, Task) or isinstance(task, TaskList) or isinstance(task, ParallelTask):
                self.tasks.append(task)

    def execute(self):
        done = True
        for task in self.tasks:
            if not task.execute():
                done = False
        return done

    def isDone(self):
        return len(self.tasks) == 0

def task1(name):
    def init() -> bool:
        print(name, " init")
    def task() -> bool:
        num = random.random()
        print(name, " random number: ", num)
        if num > 0.1:
            print(name, " done")
            return True
        else:
            return False
    return Task(init, task)

t1 = task1("t1")
t2 = task1("t2")
tlist = TaskList(t1, t2)
while not tlist.execute():
    pass


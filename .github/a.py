with open("zen.txt", "r") as f:
    lines = f.readlines()
    # Print by newline
    # print([x.split('\n') for x in lines])
    print("".join(lines))
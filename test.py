l = [[-156.66,-106.11,361],
[-151.506,56.293,456.483],
[-45.648,63.257,513.141],
[39.042,24.879,513.141],
[39.042,-99.9989,513.141]]

for item in l:
    for i in range(len(item)):
        item[i] = item[i] / 5

    print item
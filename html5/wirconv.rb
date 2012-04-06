f = open("gbody.wir")
i = 0
f.each { |line|
	t = line.split()
	printf("lines[%d]=\"%s,%s,%s,%s,%s,%s\";\n", i, t[0],t[1],t[2],t[3],t[4],t[5])
	i = i + 1
}
f.close

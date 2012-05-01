open("log.txt") { |file|
	while l = file.gets
		i = l.index("#")
		if (i > 0) then
			l.slice!(0, i+1)
			print l
		end
	end
}

#!/usr/bin/ruby

fin = open("result2.js", "r")
while line = fin.gets
  num=""
  a1=""
  a2=""
  if (line =~ /\"num\":(\d+)/) then
    num = $1
  end
  if (line =~ /\"angle1\":\"([\d.]+)\"/) then
    a1 = $1
  end
  if (line =~ /\"angle2\":\"([\d.]+)\"/) then
    a2 = $1
  end
  #printf "n=%s a1=%s a2=%s\n", num, a1, a2
  printf "%s,%s,%s\n", num, a1, a2
end

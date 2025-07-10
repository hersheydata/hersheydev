### Source : https://school.programmers.co.kr/learn/courses/30/lessons/301646

select bin(genotype) as "b"

from ecoli_data as "E"
# 형질의 정의 := 이진수로 표기했을 때, 텍스트 상에서 1로 표기된 위치를 말함.
## 형질이 1,3을 포함한다 <=> 이진법 상으로 앞에서 2번째, 뒤에서 1번째 칸에 1이 포함되어 있음을 말함

where (right(E.b,2) != "1") 
and (right(E.b,1) = "1" 
     or left(E.b,2) = "1")


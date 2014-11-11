import csv
import random

input_file = csv.reader(open("../data/predata.csv"))
output_file = open("../data/output.csv", 'w')

counter = 0;
ranks = random.sample(range(1, 234), 233)

for row in input_file:
    if ( counter != 0 ):
        #print row
        #                                           GVT Spending                        Avg Cost of attending           num inter students                  percent pop attends                 ranking
        output_file.write( str(row)[1:-1] + ',' + str(random.randint(1,50)) + ',' + str(random.randint(1,50)) + ',' + str(random.randint(1,50)) + ',' + str(random.randint(1,50)) + ',' + str(ranks[counter-1]) + '\n' )
    elif ( counter == 0 ):
        output_file.write( str(row)[1:-1] + ",'GvtSpending','AvgCostAtten','NumIntStudents','PercentPopAttends','EduRank'\n" )
        
    counter = counter + 1

output_file.close()
    
#name
#Government spending on education
#average cost of college attendance
#number of foreign/international students
#percentage of population that attends college
#education rank


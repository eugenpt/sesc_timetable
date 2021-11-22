# -*- coding: utf-8 -*-
"""
Created on %(date)s

@author: %(username)s
"""


#%%% imports

import json
import numpy as np
from numpy import nan
import pandas as pd
import re

#%%%

def fillWithLastNotNan(SD, colj):
    prev = nan
    for j in range(SD.shape[0]):
        if SD.iloc[j,colj] is nan:
            SD.iloc[j,colj] = prev
        else:
            prev = SD.iloc[j,colj]
 
def fillRowWithLastNotNan(SD, rowj):
    prev = nan
    for j in range(SD.shape[1]):
        if SD.iloc[rowj,j] is nan:
            SD.iloc[rowj,j] = prev
        else:
            prev = SD.iloc[rowj,j]


def getNum(c):
    return [a[0] for a in re.findall('(([TТ][ \.]*)?[0-9]+|музей|МУЗЕЙ)', c )]

def getProf(c):
    return re.findall(r'\w+ +\w\. ?\w\.?', c )
#%%% 

SD=pd.read_csv('NoGit/tt_wSP.csv', header=None)

headerW = 2
headerH = 3
dataLastRow = 76
dataLastCol = 47


[fillRowWithLastNotNan(SD, j) for j in range(dataLastRow+1)]
[fillWithLastNotNan(SD, j) for j in range(dataLastCol+1)]
[fillRowWithLastNotNan(SD, j) for j in range(dataLastRow+1)]
[fillWithLastNotNan(SD, j) for j in range(dataLastCol+1)]




weekday_shorts = {'Вторник':'Вт', 'Понедельник':"Пн", 'Пятница':"Пт", 'Среда':"Ср", 'Суббота':"Сб", 'Четверг':"Чт"}


classes = list(SD.loc[0][headerW+1:dataLastCol+1])
groups = list(SD.loc[2][headerW+1:dataLastCol+1])

classes_groups = {('% 4s' % str(c)):list(groups[j] for j in range(len(groups)) if classes[j]==c) for c in set(classes)}

uclasses = sorted(list(set(classes)), key=lambda c: int(c.split('_')[0])*100 + int(c.split('_')[1]))
classes_groups = {c:list(groups[j] for j in range(len(groups)) if classes[j]==c) for c in uclasses}

print(json.dumps({"Classes":uclasses, "Classes_groups":classes_groups}))

SD['daylestime'] = SD[0].map(lambda s: weekday_shorts.get(s,''))+' '+SD[1]+' '+SD[2]

SSD = pd.DataFrame()

SSD['daylestime'] = SD['daylestime'][headerH+1:dataLastRow+1]
SSD['bad'] = (SD[1]==SD[2])[headerH+1:dataLastRow+1]

Events = []

for j,g in enumerate( groups ):
    SSD[g] = SD[headerW+1+j][headerH+1:dataLastRow+1]
    
    next_done=False
    last_ix = SSD.shape[0]-1
    
    last_daylestime_x = None
    
    
    
    hSSD = list(SSD[g])
    for i in range(0, SSD.shape[0]-1):
        c = hSSD[i]
        if c in weekday_shorts:
            continue
        if list(SSD['bad'])[i]:
            continue

        if hSSD[last_ix]==c:
            continue
        
        last_ix = i
        if next_done:
            next_done = False
            continue
        
        if last_daylestime_x is not None:
            if subj == '--':
                pass
            else:
                added_times = []
                for ji in range(last_daylestime_x, i):
                    t = list(SSD['daylestime'])[ji]
                    if t not in added_times:
                        if list(SSD['bad'])[i]:
                            continue
                       
                        Events.append([t, g, subj, '/'.join(num), '/'.join(prof)])
                        added_times.append(t)

        last_daylestime_x = i
            
        num = getNum(c)
        prof = getProf(c)
        
        
        if len(num)==0:
            ni=i+1
            while(hSSD[ni]==c):
                ni=ni+1
            subj = c
            c = hSSD[ni]
            num = getNum(c)
            if len(num)==0:
                pass
            else:
                next_done = True
                if len(prof)==0:
                    prof = getProf(c)
                
        else:
            subj = c[:min([c.find(s) for s in num+prof])].strip()
        
        
        #aaa

aaa
all_cells = [x for a in SSD for x in SSD[a] if not (x is nan)]
nums = [getNum(c) for c in all_cells]
preps = [getProf(c) for c in all_cells]

subj_set = []

for j,c in enumerate(all_cells[:-1]):
    num = nums[j]
    if len(num)==0:
        if len(nums[j+1])==0:
            pass
        else:
            num = nums[j+1]
            subj = c
        aaa
        

#%%% 

if __name__=='__main__':
    print('This is ...')
    pass

#%%% 
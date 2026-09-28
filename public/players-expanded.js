// Extended historical player library for NBA Draft Duel.
// Each row: playerId|English|Chinese|aliases(comma)|team|peak season|positions(comma)|overall|archetype
// Attributes are generated consistently from archetype + overall so the library can scale cleanly.
const EXTRA_PLAYER_ROWS = [
"pettit|Bob Pettit|鲍勃·佩蒂特|佩蒂特,Pettit|ATL|1958-59|PF,C|95|big",
"maravich|Pete Maravich|皮特·马拉维奇|马拉维奇,Pistol Pete,Maravich|ATL|1972-73|SG,PG|94|creator",
"mutombo|Dikembe Mutombo|迪肯贝·穆托姆博|穆托姆博,Mutombo|ATL|1999-00|C|92|rim",
"horford|Al Horford|艾尔·霍福德|霍福德,Horford|ATL|2010-11|C,PF|89|twowaybig",
"joe_johnson|Joe Johnson|乔·约翰逊|约翰逊,单打乔,ISO Joe|ATL|2006-07|SG,SF|91|wing",
"trae|Trae Young|特雷·杨|特雷杨,杨,Trae|ATL|2021-22|PG|92|creator",

"havlicek|John Havlicek|约翰·哈夫利切克|哈夫利切克,Hondo,Havlicek|BOS|1970-71|SF,SG|96|twoway",
"mchale|Kevin McHale|凯文·麦克海尔|麦克海尔,McHale|BOS|1986-87|PF,C|95|post",
"parish|Robert Parish|罗伯特·帕里什|帕里什,Parish|BOS|1981-82|C|92|big",
"pierce|Paul Pierce|保罗·皮尔斯|皮尔斯,真理,The Truth|BOS|2001-02|SF,SG|95|wing",
"rondo|Rajon Rondo|拉简·隆多|隆多,Rondo|BOS|2011-12|PG|91|creator",
"tatum|Jayson Tatum|杰森·塔图姆|塔图姆,Tatum|BOS|2023-24|SF,PF|96|wing",

"erving|Julius Erving|朱利叶斯·欧文|J博士,欧文,Dr J,Erving|BKN|1975-76|SF|98|slasher",
"petrovic|Drazen Petrovic|德拉任·彼得洛维奇|彼得洛维奇,Petrovic|BKN|1992-93|SG|91|shooter",
"carter|Vince Carter|文斯·卡特|卡特,半人半神,Vinsanity|BKN|2004-05|SG,SF|94|slasher",
"lopez|Brook Lopez|布鲁克·洛佩兹|大洛,洛佩兹,Brook|BKN|2012-13|C|89|twowaybig",
"jefferson_rj|Richard Jefferson|理查德·杰弗森|杰弗森,RJ|BKN|2007-08|SF|88|wing",
"irving|Kyrie Irving|凯里·欧文|欧文,凯里,Kyrie|BKN|2020-21|PG,SG|95|creator",

"ljohnson|Larry Johnson|拉里·约翰逊|大妈,LJ,Larry Johnson|CHA|1992-93|PF,SF|92|slasher",
"glen_rice|Glen Rice|格伦·莱斯|莱斯,Glen Rice|CHA|1996-97|SF,SG|91|shooter",
"bogues|Muggsy Bogues|马格西·博格斯|博格斯,小虫,Muggsy|CHA|1993-94|PG|87|creator",
"dell_curry|Dell Curry|戴尔·库里|老库里,Dell|CHA|1993-94|SG|87|shooter",
"gerald_wallace|Gerald Wallace|杰拉德·华莱士|猫王,华莱士,Crash|CHA|2009-10|SF,PF|90|twoway",
"lamelo|LaMelo Ball|拉梅洛·鲍尔|三球,拉梅洛,LaMelo|CHA|2021-22|PG,SG|89|creator",

"rose|Derrick Rose|德里克·罗斯|罗斯,风城玫瑰,D Rose|CHI|2010-11|PG|96|slasher",
"rodman|Dennis Rodman|丹尼斯·罗德曼|罗德曼,大虫,Rodman|CHI|1995-96|PF,SF|92|defender",
"gilmore|Artis Gilmore|阿蒂斯·吉尔摩|吉尔摩,Gilmore|CHI|1981-82|C|93|big",
"noah|Joakim Noah|乔金·诺阿|诺阿,Noah|CHI|2013-14|C|91|rim",
"butler|Jimmy Butler|吉米·巴特勒|巴特勒,JB,Jimmy|CHI|2016-17|SG,SF|94|twoway",
"lavine|Zach LaVine|扎克·拉文|拉文,LaVine|CHI|2020-21|SG,SF|91|shooter",

"daugherty|Brad Daugherty|布拉德·多尔蒂|多尔蒂,Daugherty|CLE|1991-92|C|92|big",
"nance_sr|Larry Nance|拉里·南斯|老南斯,Nance|CLE|1988-89|PF,SF|91|twoway",
"terrell_brandon|Terrell Brandon|特雷尔·布兰登|布兰登,Brandon|CLE|1996-97|PG|89|creator",
"ilgauskas|Zydrunas Ilgauskas|扎伊德鲁纳斯·伊尔戈斯卡斯|大Z,伊尔戈斯卡斯,Big Z|CLE|2004-05|C|88|big",
"kyrie_cle|Kyrie Irving|凯里·欧文|欧文,凯里,Kyrie|CLE|2014-15|PG,SG|94|creator",
"mitchell_cle|Donovan Mitchell|多诺万·米切尔|米切尔,Spida|CLE|2022-23|SG,PG|94|creator",

"blackman|Rolando Blackman|罗兰多·布莱克曼|布莱克曼,Blackman|DAL|1983-84|SG|90|wing",
"aguire|Mark Aguirre|马克·阿吉雷|阿吉雷,Aguirre|DAL|1983-84|SF|92|scorer",
"finley|Michael Finley|迈克尔·芬利|芬利,Finley|DAL|2000-01|SF,SG|91|wing",
"nash_dal|Steve Nash|史蒂夫·纳什|纳什,Nash|DAL|2002-03|PG|93|creator",
"terry|Jason Terry|贾森·特里|特里,喷气机,Jet|DAL|2008-09|SG,PG|88|shooter",
"kidd_dal|Jason Kidd|贾森·基德|基德,Kidd|DAL|1995-96|PG|92|creator",

"english|Alex English|亚历克斯·英格利什|英格利什,English|DEN|1982-83|SF|95|scorer",
"lever|Fat Lever|法特·利弗|利弗,Lever|DEN|1986-87|PG,SG|92|creator",
"issel|Dan Issel|丹·伊塞尔|伊塞尔,Issel|DEN|1976-77|C,PF|93|big",
"mutombo_den|Dikembe Mutombo|迪肯贝·穆托姆博|穆托姆博,Mutombo|DEN|1994-95|C|92|rim",
"melo_den|Carmelo Anthony|卡梅隆·安东尼|安东尼,甜瓜,Melo|DEN|2009-10|SF,PF|95|scorer",
"billups_den|Chauncey Billups|昌西·比卢普斯|比卢普斯,Mr Big Shot|DEN|2008-09|PG|92|creator",

"dumars|Joe Dumars|乔·杜马斯|杜马斯,Dumars|DET|1989-90|SG,PG|94|twoway",
"laimbeer|Bill Laimbeer|比尔·兰比尔|兰比尔,Laimbeer|DET|1985-86|C|89|big",
"grant_hill|Grant Hill|格兰特·希尔|希尔,Grant Hill|DET|1996-97|SF,PG|96|twoway",
"rasheed|Rasheed Wallace|拉希德·华莱士|拉希德,怒吼天尊,Sheed|DET|2005-06|PF,C|92|twowaybig",
"rip|Richard Hamilton|理查德·汉密尔顿|汉密尔顿,面具侠,Rip|DET|2005-06|SG|91|shooter",
"rodman_det|Dennis Rodman|丹尼斯·罗德曼|罗德曼,大虫,Rodman|DET|1991-92|PF|91|defender",

"wilt_gsw|Wilt Chamberlain|威尔特·张伯伦|张伯伦,Wilt|GSW|1961-62|C|99|big",
"barry|Rick Barry|里克·巴里|巴里,Rick Barry|GSW|1966-67|SF|97|scorer",
"thurmond|Nate Thurmond|内特·瑟蒙德|瑟蒙德,Thurmond|GSW|1966-67|C|94|rim",
"mullin|Chris Mullin|克里斯·穆林|穆林,Mullin|GSW|1988-89|SF,SG|94|shooter",
"draymond|Draymond Green|德雷蒙德·格林|追梦,格林,Draymond|GSW|2015-16|PF,C|92|defender",
"durant_gsw|Kevin Durant|凯文·杜兰特|杜兰特,KD,Durant|GSW|2016-17|SF,PF|98|scorer",

"moses_hou|Moses Malone|摩西·马龙|摩西,Malone|HOU|1981-82|C|98|big",
"yao|Yao Ming|姚明|姚明,Yao|HOU|2006-07|C|95|post",
"tmac_hou|Tracy McGrady|特雷西·麦克格雷迪|麦迪,TMac,McGrady|HOU|2004-05|SG,SF|96|scorer",
"calvin_murphy|Calvin Murphy|卡尔文·墨菲|墨菲,Murphy|HOU|1977-78|PG,SG|90|creator",
"samson|Ralph Sampson|拉尔夫·桑普森|桑普森,Sampson|HOU|1984-85|C,PF|91|big",
"francis|Steve Francis|史蒂夫·弗朗西斯|弗朗西斯,弗老大,Francis|HOU|2001-02|PG,SG|91|slasher",

"mel_daniels|Mel Daniels|梅尔·丹尼尔斯|丹尼尔斯,Daniels|IND|1970-71|C|95|big",
"roger_brown|Roger Brown|罗杰·布朗|布朗,Roger Brown|IND|1969-70|SF|92|scorer",
"smits|Rik Smits|里克·施密茨|施密茨,Smits|IND|1997-98|C|89|post",
"jermaine|Jermaine O'Neal|杰梅因·奥尼尔|小奥尼尔,Jermaine|IND|2003-04|PF,C|94|twowaybig",
"granger|Danny Granger|丹尼·格兰杰|格兰杰,Granger|IND|2008-09|SF,SG|91|scorer",
"haliburton|Tyrese Haliburton|泰瑞斯·哈利伯顿|哈利伯顿,Haliburton|IND|2023-24|PG|93|creator",

"mcadoo|Bob McAdoo|鲍勃·麦卡杜|麦卡杜,McAdoo|LAC|1974-75|C,PF|97|scorer",
"brand|Elton Brand|埃尔顿·布兰德|布兰德,Brand|LAC|2005-06|PF,C|93|post",
"maggette|Corey Maggette|科里·马盖蒂|马盖蒂,Maggette|LAC|2004-05|SF,SG|89|slasher",
"deandre|DeAndre Jordan|德安德烈·乔丹|小乔丹,DeAndre|LAC|2015-16|C|89|rim",
"kawhi_lac|Kawhi Leonard|科怀·伦纳德|伦纳德,卡哇伊,Kawhi|LAC|2019-20|SF,SG|97|twoway",
"pg_lac|Paul George|保罗·乔治|乔治,泡椒,PG13|LAC|2020-21|SF,SG|94|twoway",

"west|Jerry West|杰里·韦斯特|韦斯特,Logo Man,Jerry West|LAL|1969-70|SG,PG|98|creator",
"baylor|Elgin Baylor|埃尔金·贝勒|贝勒,Baylor|LAL|1960-61|SF|98|slasher",
"kareem_lal|Kareem Abdul-Jabbar|卡里姆·阿卜杜尔-贾巴尔|贾巴尔,天勾,Kareem|LAL|1976-77|C|99|big",
"worthy|James Worthy|詹姆斯·沃西|沃西,Big Game James|LAL|1989-90|SF|94|slasher",
"gasol_pau|Pau Gasol|保罗·加索尔|加索尔,大加索尔,Pau|LAL|2009-10|PF,C|94|twowaybig",
"davis_lal|Anthony Davis|安东尼·戴维斯|浓眉,AD,Davis|LAL|2019-20|PF,C|97|twowaybig",

"conley|Mike Conley|迈克·康利|康利,Conley|MEM|2016-17|PG|90|creator",
"randolph|Zach Randolph|扎克·兰多夫|兰多夫,黑熊,ZBo|MEM|2010-11|PF,C|92|post",
"allen_tony|Tony Allen|托尼·阿伦|托尼阿伦,Allen|MEM|2012-13|SG,SF|88|defender",
"gay_mem|Rudy Gay|鲁迪·盖伊|盖伊,Rudy Gay|MEM|2007-08|SF|89|wing",
"shareef|Shareef Abdur-Rahim|谢里夫·阿卜杜尔-拉希姆|拉希姆,Shareef|MEM|2000-01|PF,SF|90|scorer",
"bane|Desmond Bane|德斯蒙德·贝恩|贝恩,Bane|MEM|2022-23|SG,SF|89|shooter",

"mourning_mia|Alonzo Mourning|阿朗佐·莫宁|莫宁,Mourning|MIA|1998-99|C|95|rim",
"hardaway_tim|Tim Hardaway|蒂姆·哈达威|哈达威,Tim Hardaway|MIA|1996-97|PG|93|creator",
"shaq_mia|Shaquille O'Neal|沙奎尔·奥尼尔|奥尼尔,鲨鱼,Shaq|MIA|2004-05|C|94|big",
"bosh_mia|Chris Bosh|克里斯·波什|波什,Bosh|MIA|2010-11|PF,C|93|twowaybig",
"butler_mia|Jimmy Butler|吉米·巴特勒|巴特勒,JB,Jimmy|MIA|2021-22|SF,SG|95|twoway",
"adebayo|Bam Adebayo|巴姆·阿德巴约|阿德巴约,Bam|MIA|2022-23|C,PF|92|twowaybig",

"oscar_mil|Oscar Robertson|奥斯卡·罗伯特森|大O,罗伯特森,Oscar|MIL|1970-71|PG|96|creator",
"moncrief|Sidney Moncrief|西德尼·蒙克利夫|蒙克利夫,Moncrief|MIL|1982-83|SG,PG|95|twoway",
"cummings|Terry Cummings|特里·卡明斯|卡明斯,Cummings|MIL|1984-85|PF,SF|91|scorer",
"ray_allen_mil|Ray Allen|雷·阿伦|雷阿伦,君子雷,Ray Allen|MIL|2000-01|SG|94|shooter",
"redd|Michael Redd|迈克尔·里德|里德,Redd|MIL|2006-07|SG,SF|91|shooter",
"middleton|Khris Middleton|克里斯·米德尔顿|米德尔顿,Middleton|MIL|2019-20|SF,SG|90|wing",

"love_min|Kevin Love|凯文·乐福|乐福,Love|MIN|2013-14|PF,C|94|stretchbig",
"marbury|Stephon Marbury|斯蒂芬·马布里|马布里,独狼,Marbury|MIN|1997-98|PG|92|creator",
"cassell_min|Sam Cassell|萨姆·卡塞尔|卡塞尔,Cassell|MIN|2003-04|PG|90|creator",
"wally|Wally Szczerbiak|沃利·斯泽比亚克|斯泽比亚克,Wally|MIN|2001-02|SF,SG|88|shooter",
"towns|Karl-Anthony Towns|卡尔-安东尼·唐斯|唐斯,KAT,Towns|MIN|2021-22|C,PF|94|stretchbig",
"edwards|Anthony Edwards|安东尼·爱德华兹|华子,爱德华兹,Ant|MIN|2023-24|SG,SF|95|slasher",

"davis_barons|Anthony Davis|安东尼·戴维斯|浓眉,AD,Davis|NOP|2017-18|PF,C|97|twowaybig",
"cp3_nop|Chris Paul|克里斯·保罗|保罗,CP3|NOP|2007-08|PG|97|creator",
"west_david|David West|大卫·韦斯特|韦斯特,David West|NOP|2008-09|PF|90|post",
"holiday_nop|Jrue Holiday|朱·霍勒迪|霍勒迪,Jrue|NOP|2018-19|PG,SG|91|twoway",
"cousins_nop|DeMarcus Cousins|德马库斯·考辛斯|考辛斯,表妹,Boogie|NOP|2017-18|C|94|post",
"zion|Zion Williamson|锡安·威廉森|锡安,Zion|NOP|2020-21|PF,C|92|slasher",

"ewing|Patrick Ewing|帕特里克·尤因|尤因,Ewing|NYK|1989-90|C|97|twowaybig",
"frazier|Walt Frazier|沃尔特·弗雷泽|弗雷泽,Clyde,Frazier|NYK|1969-70|PG|96|twoway",
"reed|Willis Reed|威利斯·里德|里德,Reed|NYK|1969-70|C,PF|95|big",
"king|Bernard King|伯纳德·金|伯纳德金,King|NYK|1984-85|SF|95|scorer",
"starks|John Starks|约翰·斯塔克斯|斯塔克斯,Starks|NYK|1993-94|SG|88|shooter",
"brunson|Jalen Brunson|杰伦·布伦森|布伦森,Brunson|NYK|2023-24|PG|95|creator",

"payton_okc|Gary Payton|加里·佩顿|佩顿,手套,The Glove|OKC|1999-00|PG|97|twoway",
"kemp|Shawn Kemp|肖恩·坎普|坎普,雨人,Kemp|OKC|1995-96|PF,C|94|slasher",
"allen_ray_okc|Ray Allen|雷·阿伦|雷阿伦,君子雷,Ray Allen|OKC|2006-07|SG|94|shooter",
"westbrook|Russell Westbrook|拉塞尔·威斯布鲁克|威少,Westbrook|OKC|2016-17|PG|98|slasher",
"durant_okc|Kevin Durant|凯文·杜兰特|杜兰特,KD,Durant|OKC|2013-14|SF,PF|99|scorer",
"shai|Shai Gilgeous-Alexander|谢伊·吉尔杰斯-亚历山大|亚历山大,SGA,Shai|OKC|2023-24|PG,SG|97|creator",

"howard|Dwight Howard|德怀特·霍华德|霍华德,魔兽,Dwight|ORL|2008-09|C|97|rim",
"penny|Penny Hardaway|安芬尼·哈达威|便士,Penny|ORL|1995-96|PG,SG|95|creator",
"tmac_orl|Tracy McGrady|特雷西·麦克格雷迪|麦迪,TMac,McGrady|ORL|2002-03|SG,SF|98|scorer",
"grant_orl|Horace Grant|霍雷斯·格兰特|格兰特,Horace|ORL|1994-95|PF,C|89|defender",
"turkoglu|Hedo Turkoglu|希度·特科格鲁|特科格鲁,Hedo|ORL|2007-08|SF,PF|89|creator",
"vucevic_orl|Nikola Vucevic|尼古拉·武切维奇|武切维奇,Vucevic|ORL|2018-19|C|90|stretchbig",

"iverson|Allen Iverson|阿伦·艾弗森|艾弗森,AI,Answer|PHI|2000-01|SG,PG|98|creator",
"wilt_phi|Wilt Chamberlain|威尔特·张伯伦|张伯伦,Wilt|PHI|1966-67|C|99|big",
"barkley_phi|Charles Barkley|查尔斯·巴克利|巴克利,飞猪,Barkley|PHI|1989-90|PF,SF|97|slasher",
"greer|Hal Greer|哈尔·格里尔|格里尔,Greer|PHI|1967-68|SG,PG|94|shooter",
"cheeks|Maurice Cheeks|莫里斯·奇克斯|奇克斯,Cheeks|PHI|1985-86|PG|91|defender",
"embiid|Joel Embiid|乔尔·恩比德|恩比德,大帝,Embiid|PHI|2022-23|C|98|post",

"barkley_phx|Charles Barkley|查尔斯·巴克利|巴克利,飞猪,Barkley|PHX|1992-93|PF,SF|98|slasher",
"nash_phx|Steve Nash|史蒂夫·纳什|纳什,Nash|PHX|2005-06|PG|98|creator",
"stoudemire|Amar'e Stoudemire|阿玛雷·斯塔德迈尔|小斯,Stoudemire|PHX|2007-08|PF,C|94|slasher",
"marion|Shawn Marion|肖恩·马里昂|马里昂,骇客,Marion|PHX|2005-06|SF,PF|92|twoway",
"booker|Devin Booker|德文·布克|布克,Booker|PHX|2022-23|SG,PG|95|scorer",
"kevin_johnson|Kevin Johnson|凯文·约翰逊|KJ,约翰逊,Kevin Johnson|PHX|1988-89|PG|93|creator",

"walton|Bill Walton|比尔·沃顿|沃顿,Walton|POR|1977-78|C|97|twowaybig",
"drexler|Clyde Drexler|克莱德·德雷克斯勒|德雷克斯勒,滑翔机,Drexler|POR|1991-92|SG,SF|97|slasher",
"porter|Terry Porter|特里·波特|波特,Porter|POR|1990-91|PG|91|creator",
"roy|Brandon Roy|布兰登·罗伊|罗伊,黄曼巴,BRoy|POR|2008-09|SG,SF|94|scorer",
"aldridge_por|LaMarcus Aldridge|拉马库斯·阿尔德里奇|阿尔德里奇,阿德,LMA|POR|2014-15|PF,C|93|post",
"lillard|Damian Lillard|达米安·利拉德|利拉德,表哥,Dame|POR|2019-20|PG|96|creator",

"robertson_sac|Oscar Robertson|奥斯卡·罗伯特森|大O,罗伯特森,Oscar|SAC|1963-64|PG|99|creator",
"lucas|Jerry Lucas|杰里·卢卡斯|卢卡斯,Lucas|SAC|1965-66|PF,C|95|big",
"webber|Chris Webber|克里斯·韦伯|韦伯,CWebb|SAC|2000-01|PF,C|96|creatorbig",
"peja|Peja Stojakovic|佩贾·斯托贾科维奇|佩贾,Peja|SAC|2003-04|SF,SG|93|shooter",
"bibby|Mike Bibby|迈克·毕比|毕比,Bibby|SAC|2004-05|PG|89|creator",
"cousins_sac|DeMarcus Cousins|德马库斯·考辛斯|考辛斯,表妹,Boogie|SAC|2016-17|C|95|post",

"duncan|Tim Duncan|蒂姆·邓肯|邓肯,石佛,Duncan|SAS|2002-03|PF,C|99|twowaybig",
"robinson|David Robinson|大卫·罗宾逊|罗宾逊,海军上将,Admiral|SAS|1993-94|C|99|twowaybig",
"gervin|George Gervin|乔治·格文|格文,冰人,Iceman|SAS|1979-80|SG,SF|96|scorer",
"parker|Tony Parker|托尼·帕克|帕克,Parker|SAS|2012-13|PG|94|creator",
"ginobili|Manu Ginobili|马努·吉诺比利|吉诺比利,妖刀,Manu|SAS|2007-08|SG,PG|94|creator",
"kawhi_sas|Kawhi Leonard|科怀·伦纳德|伦纳德,卡哇伊,Kawhi|SAS|2015-16|SF,SG|97|twoway",

"vince_tor|Vince Carter|文斯·卡特|卡特,半人半神,Vinsanity|TOR|2000-01|SG,SF|96|slasher",
"bosh_tor|Chris Bosh|克里斯·波什|波什,Bosh|TOR|2009-10|PF,C|94|twowaybig",
"derozan_tor|DeMar DeRozan|德马尔·德罗赞|德罗赞,DeRozan|TOR|2016-17|SG,SF|94|scorer",
"lowry|Kyle Lowry|凯尔·洛瑞|洛瑞,Lowry|TOR|2015-16|PG|92|creator",
"kawhi_tor|Kawhi Leonard|科怀·伦纳德|伦纳德,卡哇伊,Kawhi|TOR|2018-19|SF,SG|98|twoway",
"siakam|Pascal Siakam|帕斯卡尔·西亚卡姆|西亚卡姆,Siakam|TOR|2019-20|PF,SF|91|twoway",

"malone_karl|Karl Malone|卡尔·马龙|马龙,邮差,Mailman|UTA|1996-97|PF|98|post",
"stockton|John Stockton|约翰·斯托克顿|斯托克顿,Stockton|UTA|1989-90|PG|97|creator",
"dantley|Adrian Dantley|阿德里安·丹特利|丹特利,Dantley|UTA|1983-84|SF|95|scorer",
"gobert|Rudy Gobert|鲁迪·戈贝尔|戈贝尔,Gobert|UTA|2020-21|C|92|rim",
"mitchell_uta|Donovan Mitchell|多诺万·米切尔|米切尔,Spida|UTA|2020-21|SG,PG|93|creator",
"kirilenko|Andrei Kirilenko|安德烈·基里连科|基里连科,AK47|UTA|2003-04|SF,PF|92|defender",

"hayes|Elvin Hayes|埃尔文·海耶斯|海耶斯,大E,Elvin Hayes|WAS|1974-75|PF,C|97|big",
"unseld|Wes Unseld|韦斯·昂塞尔德|昂塞尔德,Unseld|WAS|1968-69|C,PF|95|big",
"arenas|Gilbert Arenas|吉尔伯特·阿里纳斯|阿里纳斯,大将军,Agent Zero|WAS|2005-06|PG,SG|95|creator",
"wall|John Wall|约翰·沃尔|沃尔,Wall|WAS|2016-17|PG|94|slasher",
"beal|Bradley Beal|布拉德利·比尔|比尔,Beal|WAS|2020-21|SG,PG|93|scorer",
"jamison|Antawn Jamison|安托万·贾米森|贾米森,Jamison|WAS|2007-08|PF,SF|90|scorer"
];

const ARCH = {
  creator:{finishing:88,midRange:91,threePoint:88,playmaking:98,perimeterDefense:83,interiorDefense:48,rebounding:58,athleticism:90,efficiency:93,usage:91},
  scorer:{finishing:94,midRange:96,threePoint:90,playmaking:88,perimeterDefense:84,interiorDefense:62,rebounding:72,athleticism:91,efficiency:94,usage:94},
  shooter:{finishing:83,midRange:93,threePoint:98,playmaking:84,perimeterDefense:84,interiorDefense:48,rebounding:58,athleticism:84,efficiency:97,usage:86},
  slasher:{finishing:98,midRange:88,threePoint:79,playmaking:88,perimeterDefense:88,interiorDefense:68,rebounding:76,athleticism:98,efficiency:93,usage:92},
  wing:{finishing:91,midRange:92,threePoint:89,playmaking:86,perimeterDefense:90,interiorDefense:66,rebounding:74,athleticism:92,efficiency:93,usage:89},
  twoway:{finishing:92,midRange:91,threePoint:86,playmaking:88,perimeterDefense:97,interiorDefense:79,rebounding:82,athleticism:93,efficiency:94,usage:89},
  defender:{finishing:82,midRange:76,threePoint:73,playmaking:76,perimeterDefense:99,interiorDefense:92,rebounding:93,athleticism:92,efficiency:88,usage:72},
  rim:{finishing:91,midRange:68,threePoint:35,playmaking:68,perimeterDefense:78,interiorDefense:99,rebounding:98,athleticism:94,efficiency:94,usage:82},
  big:{finishing:96,midRange:84,threePoint:45,playmaking:76,perimeterDefense:76,interiorDefense:95,rebounding:97,athleticism:91,efficiency:95,usage:90},
  post:{finishing:97,midRange:92,threePoint:55,playmaking:80,perimeterDefense:78,interiorDefense:93,rebounding:94,athleticism:88,efficiency:95,usage:92},
  twowaybig:{finishing:95,midRange:87,threePoint:70,playmaking:79,perimeterDefense:84,interiorDefense:98,rebounding:96,athleticism:92,efficiency:96,usage:89},
  stretchbig:{finishing:91,midRange:94,threePoint:93,playmaking:82,perimeterDefense:76,interiorDefense:88,rebounding:93,athleticism:84,efficiency:95,usage:89},
  creatorbig:{finishing:94,midRange:91,threePoint:78,playmaking:94,perimeterDefense:79,interiorDefense:90,rebounding:94,athleticism:90,efficiency:95,usage:92}
};
function clamp(v){ return Math.max(25,Math.min(99,Math.round(v))); }
function makeCard(row){
  const [playerId,nameEn,nameZh,aliases,teamId,peakSeason,positions,overallRaw,archKey]=row.split("|");
  const overall=Number(overallRaw), base=ARCH[archKey]||ARCH.wing, delta=(overall-92)*0.55;
  const attrs={}; for(const [k,v] of Object.entries(base)) attrs[k]=clamp(v+delta);
  return {playerId,nameEn,nameZh,aliases:aliases.split(",").filter(Boolean),teamId,peakSeason,
    eligiblePositions:positions.split(","),overall,...attrs};
}
const existingKeys=new Set(window.PLAYER_CARDS.map(c=>c.teamId+"::"+c.playerId));
for(const row of EXTRA_PLAYER_ROWS){
  const c=makeCard(row), key=c.teamId+"::"+c.playerId;
  if(!existingKeys.has(key)){ window.PLAYER_CARDS.push(c); existingKeys.add(key); }
}

import type {Player, Attributes} from './data';

// Career-peak game balancing, not official measurements or predictions of future ability.
// Columns: Chinese name | full English name + accepted aliases | positions (primary first)
// | rating | pace finishing passing dribbling defending physical aerial saving | style.
const rosters: Record<string, string> = {
BE: `
库尔图瓦|Thibaut Courtois 库尔图瓦|GK|95|54 18 72 41 22 86 94 97|高点扑救
普法夫|Jean Marie Pfaff 普法夫|GK|92|57 15 65 38 20 82 88 94|反应扑救
普雷德霍姆|Michel Preudhomme 普雷德霍姆 普雷德奥姆|GK|93|58 16 66 40 20 81 87 95|反应扑救
孔帕尼|Vincent Kompany 孔帕尼|CB|92|77 51 78 72 94 94 92 10|防线统领
费尔通亨|Jan Vertonghen 维尔通亨|CB LB|89|72 55 81 74 90 86 85 10|后场出球
阿尔德韦雷尔德|Toby Alderweireld 托比|CB RB|89|72 45 85 66 91 84 88 10|长传出球
范比滕|Daniel van Buyten 范比滕|CB|87|58 60 66 51 86 94 96 10|高空屏障
维尔马伦|Thomas Vermaelen 费尔马伦|CB LB|87|76 57 76 69 88 86 87 10|上抢拦截
埃里克·格雷茨|Eric Gerets 格雷茨 格雷茨斯|RB|91|85 48 82 78 90 88 76 10|边路攻守
扬·瑟勒芒斯|Jan Ceulemans 瑟勒芒斯 塞勒芒斯|AM ST|92|78 86 87 85 60 91 93 10|后插上争顶
托马斯·默尼耶|Thomas Meunier 默尼耶 穆尼耶|RB RW|85|81 68 78 76 79 86 83 10|边路前插
蒂莫西·卡斯塔涅|Timothy Castagne 卡斯塔涅|RB LB|83|82 46 72 75 80 79 76 10|双侧往返
阿图尔·泰特|Arthur Theate 泰特 蒂特|CB LB|82|77 35 72 63 83 85 81 10|左侧保护
德布劳内|Kevin De Bruyne 德布劳内 丁丁|CM AM|96|79 88 98 91 66 81 70 10|穿透传球
恩佐·希福|Enzo Scifo 希福 西福|AM CM|92|77 84 93 92 47 70 59 10|古典组织
维尔弗里德·范莫尔|Wilfried Van Moer 范莫尔|CM DM|90|77 69 91 86 79 76 61 10|中场调度
维特塞尔|Axel Witsel 维特塞尔 维策尔|DM CM CB|88|67 66 86 82 85 87 83 10|中场屏障
穆萨·登贝莱|Mousa Dembele 穆萨登贝莱 登贝莱|CM DM|90|78 65 85 94 80 93 65 10|持球推进
费莱尼|Marouane Fellaini 费莱尼|CM DM AM|87|62 75 74 70 80 94 97 10|中场制空
纳英戈兰|Radja Nainggolan 纳因戈兰|CM DM|90|81 82 82 83 89 90 66 10|全场扫荡
蒂勒曼斯|Youri Tielemans 蒂莱曼斯|CM DM|86|65 80 90 83 76 77 58 10|远射调度
罗梅卢·卢卡库|Romelu Lukaku 卢卡库|ST|91|84 92 75 78 35 96 88 10|力量终结
埃登·阿扎尔|Eden Hazard 阿扎尔 扎球王|LW AM RW|95|92 88 91 98 35 76 50 10|盘带突破
梅尔滕斯|Dries Mertens 梅尔滕斯 默滕斯|ST LW RW|91|89 91 85 93 30 56 43 10|灵巧终结
保罗·范希姆斯特|Paul Van Himst 范希姆斯特 范希姆斯特|ST AM|93|85 94 88 91 35 77 72 10|技术前锋
马克·威尔莫茨|Marc Wilmots 威尔莫茨|ST AM|88|74 86 77 76 56 91 88 10|强力前插
吕克·尼利斯|Luc Nilis 尼利斯|ST|89|75 93 82 87 25 74 64 10|双足终结
杰雷米·多库|Jeremy Doku 多库|LW RW|86|97 73 79 95 30 66 40 10|高速突破
莱安德罗·特罗萨德|Leandro Trossard 特罗萨德|LW ST RW|86|82 86 84 88 40 64 51 10|灵活跑位
克里斯蒂安·本特克|Christian Benteke 本特克|ST|86|73 85 65 68 30 94 95 10|禁区支点
`,
HR: `
德拉任·拉迪奇|Drazen Ladic 拉迪奇|GK|87|53 14 58 34 20 80 83 89|门线反应
达尼耶尔·苏巴西奇|Danijel Subasic 苏巴西奇|GK|88|49 15 65 35 20 82 86 90|门线扑救
多米尼克·利瓦科维奇|Dominik Livakovic 利瓦科维奇|GK|88|54 15 66 37 20 81 83 91|反应扑救
罗伯特·雅尔尼|Robert Jarni 雅尔尼 贾尔尼|LB LW|90|93 62 83 85 81 75 64 10|左路突进
达里奥·西米奇|Dario Simic 西米奇|CB RB|87|75 35 68 59 89 84 83 10|多面防守
罗伯特·科瓦奇|Robert Kovac 罗伯特科瓦奇|CB|88|70 30 64 51 91 89 87 10|中路盯防
斯拉文·比利奇|Slaven Bilic 比利奇|CB|87|64 40 69 55 88 91 90 10|强硬防守
伊戈尔·图多尔|Igor Tudor 图多尔|CB DM|87|64 60 71 62 87 92 93 10|高空屏障
韦德兰·乔尔卢卡|Vedran Corluka 乔尔卢卡|CB RB|86|62 35 73 63 88 89 86 10|稳健防守
德扬·洛夫伦|Dejan Lovren 洛夫伦|CB|85|69 37 69 57 85 89 88 10|中路对抗
约什科·格瓦迪奥尔|Josko Gvardiol 格瓦迪奥尔 格瓦迪奥尔|CB LB|88|84 59 82 79 88 88 84 10|带球出击
希梅·弗尔萨利科|Sime Vrsaljko 弗尔萨利科 福萨里科|RB|85|85 40 76 75 83 78 73 10|右路往返
卢卡·莫德里奇|Luka Modric 莫德里奇 魔笛|CM AM|96|78 80 97 95 76 69 49 10|节奏大师
伊万·拉基蒂奇|Ivan Rakitic 拉基蒂奇|CM AM DM|91|69 84 93 86 77 78 66 10|传射调度
兹沃尼米尔·博班|Zvonimir Boban 博班|AM CM|92|78 84 94 93 57 73 64 10|古典组织
罗伯特·普罗辛内茨基|Robert Prosinecki 普罗辛内茨基 普罗辛内斯基|AM CM|91|68 81 94 96 43 69 53 10|盘带组织
马特奥·科瓦契奇|Mateo Kovacic 科瓦契奇 科瓦西奇|CM DM|89|82 61 89 95 75 78 49 10|持球推进
马塞洛·布罗佐维奇|Marcelo Brozovic 布罗佐维奇 B罗|DM CM|89|74 70 89 83 87 80 64 10|中场枢纽
尼科·科瓦奇|Niko Kovac 尼科科瓦奇|DM CM|86|66 59 78 68 88 86 83 10|拦截保护
阿廖沙·阿萨诺维奇|Aljosa Asanovic 阿萨诺维奇|AM CM|88|70 78 91 87 53 75 61 10|左脚组织
尼科·克拉尼察|Niko Kranjcar 克拉尼察 克拉尼查|AM CM|86|64 83 88 89 40 77 66 10|前场创造
达沃·苏克|Davor Suker 苏克|ST|94|80 97 78 90 28 77 79 10|左脚终结
马里奥·曼朱基奇|Mario Mandzukic 曼朱基奇|ST LW|91|77 88 72 73 66 94 95 10|压迫支点
阿伦·博克西奇|Alen Boksic 博克西奇|ST|90|91 84 76 88 30 88 80 10|冲击防线
伊万·佩里西奇|Ivan Perisic 佩里西奇|LW RW|90|88 85 83 85 65 86 89 10|双足边锋
爱德华多·达席尔瓦|Eduardo da Silva 爱德华多|ST LW|87|79 91 74 85 26 67 68 10|禁区跑位
安德烈·克拉马里奇|Andrej Kramaric 克拉马里奇|ST AM|88|76 91 83 88 35 68 65 10|灵活终结
伊维察·奥利奇|Ivica Olic 奥利奇|ST LW|87|91 82 69 78 52 84 72 10|前场冲刺
安特·雷比奇|Ante Rebic 雷比奇|LW ST RW|85|91 78 71 81 44 89 70 10|强力突破
戈兰·弗拉奥维奇|Goran Vlaovic 弗拉奥维奇|ST RW|85|84 87 71 80 29 75 65 10|快速终结
`,
CO: `
雷内·伊基塔|Rene Higuita 伊基塔|GK|88|70 40 85 65 42 79 78 88|出击组织
奥斯卡·科尔多巴|Oscar Cordoba 奥斯卡科尔多巴|GK|89|55 15 65 37 20 83 86 91|门线扑救
大卫·奥斯皮纳|David Ospina 奥斯皮纳|GK|87|61 15 68 37 20 75 79 90|反应扑救
伊万·科尔多巴|Ivan Cordoba 伊万科尔多巴 科尔多巴|CB RB|91|92 35 65 64 94 86 89 10|快速补位
马里奥·耶佩斯|Mario Yepes 耶佩斯|CB|89|62 38 70 55 92 91 92 10|防线指挥
安德烈斯·埃斯科巴|Andres Escobar 安德烈斯埃斯科巴 埃斯科巴|CB|87|73 35 77 66 89 82 84 10|后场出球
克里斯蒂安·萨帕塔|Cristian Zapata 克里斯蒂安萨帕塔|CB|85|77 30 62 49 86 89 87 10|中路屏障
达文森·桑切斯|Davinson Sanchez 达文森桑切斯 达文森|CB|85|83 30 62 51 84 91 87 10|回追防守
胡安·卡米洛·苏尼加|Juan Camilo Zuniga 苏尼加 祖尼加|RB LB|86|87 46 77 84 80 72 58 10|边路突进
巴勃罗·阿尔梅罗|Pablo Armero 阿尔梅罗|LB LW|85|94 49 73 79 77 78 61 10|高速边路
路易斯·费尔南多·埃雷拉|Luis Fernando Herrera 埃雷拉|RB|84|78 35 72 71 84 73 60 10|边路保护
弗兰克·法布拉|Frank Fabra 法布拉|LB|82|81 48 75 80 75 82 60 10|左路助攻
卡洛斯·巴尔德拉马|Carlos Valderrama 巴尔德拉马 金毛狮王|AM CM|93|54 65 98 93 38 66 47 10|传球大师
哈梅斯·罗德里格斯|James Rodriguez 哈梅斯 J罗|AM RW|92|77 90 94 91 38 69 61 10|左脚创造
胡安·夸德拉多|Juan Cuadrado 夸德拉多|RM RW RB|88|93 75 84 92 65 66 52 10|右路推进
弗雷迪·林孔|Freddy Rincon 林孔|CM DM|89|84 79 83 82 80 94 86 10|全能中场
莱昂内尔·阿尔瓦雷斯|Leonel Alvarez 莱昂内尔阿尔瓦雷斯|DM CM|87|65 43 75 65 92 88 71 10|中场扫荡
威尔马尔·巴里奥斯|Wilmar Barrios 巴里奥斯|DM|84|74 35 73 66 89 83 59 10|拦截覆盖
卡洛斯·桑切斯|Carlos Sanchez 卡洛斯桑切斯|DM CM|83|66 37 71 63 85 87 73 10|中路保护
阿贝尔·阿吉拉尔|Abel Aguilar 阿吉拉尔|CM DM|83|63 59 79 70 81 84 80 10|攻守衔接
麦克内利·托雷斯|Macnelly Torres 麦克内利托雷斯|AM CM|84|65 65 89 86 35 61 43 10|前场组织
拉达梅尔·法尔考|Radamel Falcao 法尔考 老虎|ST|94|82 97 72 83 25 82 95 10|禁区终结
法斯蒂诺·阿斯普里拉|Faustino Asprilla 阿斯普里拉|ST RW|91|91 85 82 94 29 77 77 10|灵感突破
路易斯·迪亚斯|Luis Diaz 路易斯迪亚斯 迪亚斯|LW|90|94 85 80 94 45 74 64 10|左路突破
卡洛斯·巴卡|Carlos Bacca 巴卡|ST|87|82 90 67 77 24 78 74 10|禁区跑位
杰克逊·马丁内斯|Jackson Martinez 杰克逊马丁内斯 J马|ST|88|81 91 65 74 29 91 91 10|强力终结
杜万·萨帕塔|Duvan Zapata 杜万萨帕塔 萨帕塔|ST|87|79 87 70 77 30 97 87 10|力量支点
阿道夫·瓦伦西亚|Adolfo Valencia 瓦伦西亚|ST|87|88 86 67 81 30 89 83 10|冲击前锋
维克托·阿里斯蒂萨瓦尔|Victor Aristizabal 阿里斯蒂萨瓦尔|ST|86|77 89 72 80 25 74 74 10|门前终结
特奥菲洛·古铁雷斯|Teofilo Gutierrez 特奥菲洛 古铁雷斯|ST AM|85|73 85 82 85 33 80 66 10|前场串联
`,
CL: `
克劳迪奥·布拉沃|Claudio Bravo 布拉沃|GK|90|62 16 88 48 25 78 84 92|门将出球
塞尔吉奥·利文斯通|Sergio Livingstone 利文斯通|GK|86|53 14 55 30 18 79 84 88|门线扑救
内尔森·塔皮亚|Nelson Tapia 塔皮亚|GK|84|49 12 56 29 18 82 85 86|稳健扑救
埃利亚斯·菲格罗亚|Elias Figueroa 菲格罗亚|CB|95|78 45 80 67 98 93 96 10|防线统领
阿尔韦托·金塔诺|Alberto Quintano 金塔诺|CB|88|67 36 68 54 91 88 91 10|中路屏障
瓦尔多·庞塞|Waldo Ponce 庞塞|CB|83|64 42 69 55 85 85 88 10|高空保护
贡萨洛·哈拉|Gonzalo Jara 哈拉 贾拉|CB RB|82|74 32 71 60 83 79 74 10|防守补位
巴勃罗·孔特雷拉斯|Pablo Contreras 巴勃罗孔特雷拉斯|CB RB|84|76 37 71 61 86 83 82 10|多面防守
毛里西奥·伊斯拉|Mauricio Isla 伊斯拉|RB RW|86|86 51 80 80 80 77 65 10|右路往返
尤金尼奥·梅纳|Eugenio Mena 梅纳|LB|83|85 35 72 76 80 74 60 10|边路覆盖
让·博塞茹尔|Jean Beausejour 博塞茹尔 博塞朱尔|LB LW|84|83 57 79 78 75 87 69 10|左路助攻
塞尔吉奥·纳瓦罗|Sergio Navarro 纳瓦罗|LB|85|77 35 73 67 87 79 74 10|边路保护
阿图罗·比达尔|Arturo Vidal 比达尔|CM DM|92|79 84 84 81 91 93 90 10|全能扫荡
加里·梅德尔|Gary Medel 梅德尔|DM CB|87|72 45 75 64 92 94 74 10|强硬拦截
查尔斯·阿朗吉斯|Charles Aranguiz 阿朗吉斯 阿兰吉斯|CM DM|87|76 70 88 84 83 75 58 10|中场衔接
马塞洛·迪亚斯|Marcelo Diaz 马塞洛迪亚斯|DM CM|85|63 59 91 80 81 68 47 10|后场调度
大卫·皮萨罗|David Pizarro 皮萨罗|CM DM|89|61 67 94 91 74 61 40 10|深位组织
马蒂亚斯·费尔南德斯|Matias Fernandez 马蒂亚斯 马蒂亚斯费尔南德斯|AM CM|87|77 79 89 94 33 62 44 10|技术创造
豪尔赫·巴尔迪维亚|Jorge Valdivia 巴尔迪维亚 巴尔迪维亚|AM|88|68 68 94 96 25 61 38 10|灵感传球
豪尔赫·托罗|Jorge Toro 托罗|CM AM|85|73 78 85 82 62 76 58 10|传射组织
法比安·埃斯泰|Fabian Estay 埃斯泰|AM CM|84|69 74 87 85 42 65 49 10|前场调度
伊万·萨莫拉诺|Ivan Zamorano 萨莫拉诺|ST|93|82 94 67 76 35 91 98 10|空中霸主
马塞洛·萨拉斯|Marcelo Salas 萨拉斯|ST|92|83 95 74 87 29 81 85 10|左脚终结
阿莱克西斯·桑切斯|Alexis Sanchez 阿莱克西斯 桑切斯|LW ST RW|93|91 89 87 95 49 79 63 10|持球突击
莱昂内尔·桑切斯|Leonel Sanchez 莱昂内尔桑切斯|LW ST|90|85 89 82 90 35 81 63 10|左翼突破
爱德华多·巴尔加斯|Eduardo Vargas 巴尔加斯|ST RW|86|88 87 72 83 30 74 64 10|前场穿插
温贝托·苏亚索|Humberto Suazo 苏亚索 苏亚佐|ST|88|71 94 76 85 25 87 71 10|禁区终结
豪尔赫·阿拉维纳|Jorge Aravena 阿拉维纳|LW AM|86|72 88 87 86 30 76 63 10|左脚传射
帕特里西奥·亚涅斯|Patricio Yanez 亚涅斯|RW LW|86|94 73 76 89 29 63 48 10|高速边锋
毛里西奥·皮尼利亚|Mauricio Pinilla 皮尼利亚|ST|83|72 84 63 72 28 88 88 10|禁区支点
`,
BR: `
克劳迪奥·塔法雷尔|Claudio Taffarel 塔法雷尔 塔法雷尔|GK|90|54 13 61 35 20 81 86 93|反应扑救
马尔基尼奥斯|Marquinhos 马尔基尼奥斯 马基尼奥斯|CB DM|90|82 46 81 70 92 85 88 10|快速补位
吉尔伯托·席尔瓦|Gilberto Silva 吉尔伯托席尔瓦 吉尔伯托|DM CM|89|72 51 79 66 94 89 84 10|中场屏障
阿德里亚诺|Adriano 莱特 阿德|ST|93|87 96 70 86 28 98 90 10|力量终结
`,
AR: `
塞尔吉奥·戈耶切亚|Sergio Goycochea 戈耶切亚 戈伊科切亚|GK|88|54 12 55 33 18 80 82 91|门线反应
巴勃罗·萨巴莱塔|Pablo Zabaleta 萨巴莱塔 萨巴莱塔|RB|88|77 45 76 72 89 85 72 10|边路防守
恩佐·费尔南德斯|Enzo Fernandez 恩佐 恩佐费尔南德斯|CM DM|86|69 73 90 82 77 78 62 10|中场调度
劳塔罗·马丁内斯|Lautaro Martinez 劳塔罗 劳塔罗马丁内斯|ST|91|84 93 76 87 46 88 86 10|压迫终结
保罗·迪巴拉|Paulo Dybala 迪巴拉 小魔仙|ST AM RW|91|83 91 90 95 32 65 46 10|左脚串联
`,
FR: `
史蒂夫·曼丹达|Steve Mandanda 曼丹达|GK|87|51 14 64 34 18 88 84 90|门线扑救
朱尔·孔德|Jules Kounde 孔德|CB RB|88|85 40 77 72 90 80 80 10|快速防守
奥雷利安·楚阿梅尼|Aurelien Tchouameni 楚阿梅尼 琼阿梅尼|DM CM CB|87|72 60 81 75 89 90 85 10|中场屏障
奥斯曼·登贝莱|Ousmane Dembele 登贝莱 奥斯曼登贝莱|RW LW ST|91|97 84 85 96 29 61 42 10|双足突破
奥利维耶·吉鲁|Olivier Giroud 吉鲁 大吉鲁|ST|88|55 89 78 68 42 94 96 10|空中支点
`,
DE: `
米夏埃尔·巴拉克|Michael Ballack 巴拉克|CM AM DM|94|72 88 91 84 82 91 89 10|全能中场
马克-安德烈·特尔施特根|Marc Andre ter Stegen 特尔施特根 特狮|GK|92|56 15 88 48 22 82 86 94|门将出球
安东尼奥·吕迪格|Antonio Rudiger 吕迪格 鲁迪格|CB|90|88 39 73 59 92 95 89 10|回追对抗
弗洛里安·维尔茨|Florian Wirtz 维尔茨|AM CM LW|90|81 84 93 95 45 66 46 10|技术创造
勒鲁瓦·萨内|Leroy Sane 萨内|LW RW|89|97 83 82 91 35 73 52 10|高速突破
`,
ES: `
佩佩·雷纳|Pepe Reina 雷纳 雷纳|GK|89|56 14 81 41 20 85 88 90|出击传球
艾默里克·拉波尔特|Aymeric Laporte 拉波尔特|CB LB|88|69 40 85 66 90 86 89 10|左脚出球
佩德里|Pedri 佩德里|CM AM|90|76 72 94 94 72 61 43 10|传控组织
拉明·亚马尔|Lamine Yamal 亚马尔 亚马尔|RW|91|88 83 91 97 30 59 44 10|右翼创造
胡安·马塔|Juan Mata 马塔|AM RW LW|90|72 85 94 91 31 55 42 10|前场创造
`,
IT: `
詹卢卡·帕柳卡|Gianluca Pagliuca 帕柳卡|GK|91|57 13 63 34 18 83 85 94|门线扑救
莱昂纳多·博努奇|Leonardo Bonucci 博努奇|CB|90|62 46 91 63 90 86 88 10|长传出球
尼科洛·巴雷拉|Nicolo Barella 巴雷拉|CM AM|89|81 77 88 87 82 80 61 10|全能中场
马里奥·巴洛特利|Mario Balotelli 巴洛特利 巴神|ST|88|82 92 74 86 27 93 85 10|强力终结
`,
NL: `
雅斯珀·西莱森|Jasper Cillessen 西莱森 希勒森|GK|86|56 12 77 39 18 75 80 88|门将出球
马泰斯·德利赫特|Matthijs de Ligt 德利赫特 德里赫特|CB|88|72 41 76 61 89 94 93 10|高空屏障
奈杰尔·德容|Nigel de Jong 奈杰尔德容|DM CM|88|68 37 73 67 93 92 68 10|拦截扫荡
孟菲斯·德佩|Memphis Depay 德佩 孟菲斯|ST LW|88|87 86 83 91 30 84 58 10|前场突破
`,
PT: `
鲁伊·席尔瓦|Rui Silva 鲁伊席尔瓦 鲁伊西尔瓦|GK|83|54 12 70 36 18 81 82 85|稳健扑救
努诺·瓦伦特|Nuno Valente 瓦伦特|LB|85|75 36 72 65 87 83 76 10|左侧防守
维蒂尼亚|Vitinha 维蒂尼亚 维天拿|CM DM|88|75 72 92 93 71 63 45 10|传控组织
里卡多·夸雷斯马|Ricardo Quaresma 夸雷斯马 夸雷斯马|RW LW|89|88 78 86 95 24 64 45 10|外脚背创造
`,
EN: `
彼得·希尔顿|Peter Shilton 希尔顿 希尔顿|GK|93|52 12 58 32 18 87 91 95|门线大师
约翰·斯通斯|John Stones 斯通斯|CB DM|89|73 39 88 79 88 83 85 10|后场组织
裘德·贝林厄姆|Jude Bellingham 贝林厄姆 贝林|CM AM|92|84 87 89 92 78 87 81 10|全能前插
布卡约·萨卡|Bukayo Saka 萨卡|RW LW|90|89 86 87 93 58 72 54 10|边路创造
`,
UY: `
法比安·卡里尼|Fabian Carini 卡里尼 卡里尼|GK|84|52 12 57 32 18 79 82 86|门线扑救
塞巴斯蒂安·科茨|Sebastian Coates 科茨 科茨|CB|86|57 42 67 46 86 96 97 10|高空屏障
曼努埃尔·乌加特|Manuel Ugarte 乌加特|DM CM|84|75 37 74 68 89 87 62 10|中场扫荡
塞巴斯蒂安·阿布鲁|Sebastian Abreu 阿布鲁|ST|85|51 86 64 62 28 90 94 10|高点支援
`,
CN: `
王大雷|Wang Dalei 王大雷|GK|79|60 12 72 36 18 80 79 82|出击长传
李学鹏|Li Xuepeng 李学鹏|LB CB|76|78 32 65 65 75 78 68 10|左路往返
肇俊哲|Zhao Junzhe 肇俊哲|CM DM|80|72 58 75 72 79 78 60 10|中场衔接
张玉宁|Zhang Yuning 张玉宁 张玉宁1997|ST|77|65 78 62 65 28 83 81 10|禁区支点
艾克森|Elkeson 艾克森 埃尔克森|ST LW|84|80 87 72 83 32 86 80 10|强力终结
`,
JP: `
铃木彩艳|Zion Suzuki 铃木彩艳 鈴木彩艶|GK|79|62 12 71 38 18 85 83 80|出击扑救
板仓滉|Ko Itakura 板仓滉|CB DM|81|74 34 75 63 82 79 80 10|后场出球
守田英正|Hidemasa Morita 守田英正|DM CM|81|69 48 80 76 81 73 59 10|中场衔接
久保龙彦|Tatsuhiko Kubo 久保龙彦 久保竜彦|ST|80|76 83 58 68 25 80 85 10|禁区争顶
南野拓实|Takumi Minamino 南野拓实 南野拓實|AM LW ST|83|82 82 80 85 46 64 52 10|前场穿插
`,
KR: `
金承奎|Kim Seung Gyu 金承奎|GK|80|55 12 65 32 18 81 81 83|反应扑救
薛英佑|Seol Young Woo 薛英佑 雪荣佑|RB LB|78|80 35 69 70 76 73 62 10|双侧覆盖
李乙容|Lee Eul Yong 李乙容|CM DM|79|68 64 80 74 74 72 55 10|左脚调度
曹圭成|Cho Gue Sung 曹圭成 曹圭成|ST|79|72 78 59 64 31 85 88 10|禁区制空
`,
};

// Keep one identity per person. Full names resolve same-surname ambiguity.
export const EXTRA_PLAYERS: Player[] = Object.entries(rosters).flatMap(([nation, text]) =>
  text.trim().split('\n').map((line, index) => {
    const [name, aliases, pos, rating, values, style] = line.split('|');
    const positions = pos.split(' '), primaryPosition = positions[0];
    const group: Player['group'] = primaryPosition === 'GK' ? 'GK' : ['CB','LB','RB'].includes(primaryPosition) ? 'D' : ['CM','DM','AM','LM','RM'].includes(primaryPosition) ? 'M' : 'F';
    const keys: (keyof Attributes)[] = ['pace','finishing','passing','dribbling','defending','physical','aerial','saving'];
    const nums = values.split(' ').map(Number);
    return {id:`${nation}-exp-${index}`, name, aliases, nation, positions, primaryPosition, group, rating:Number(rating), attributes:Object.fromEntries(keys.map((k,i)=>[k,nums[i]])) as Attributes, tags:[style]};
  })
);

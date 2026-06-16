'use strict';

/* ================================================================
   数 据 层
   维度顺序：[D1锐利干冽, D2浓郁苦韵, D3甜润乳脂, D4草本木质, D5热带果爆, D6厚重陈香, D7轻盈气泡]
   ================================================================ */

const QUESTIONS = [
  {
    id: 'Q1',
    text: '第一眼，你给人的轮廓感是？',
    options: [
      { id: 'A', text: '线条利落、轮廓清晰，第一眼就有存在感' },
      { id: 'B', text: '线条柔和顺滑，让人觉得好相处、没距离' },
      { id: 'C', text: '沉稳大气、有分量，让人觉得靠得住' },
      { id: 'D', text: '清瘦疏淡、留白感强，带点高级的距离感' },
      { id: 'E', text: '充满力量与生命力，藏不住一股野劲儿' },
    ],
  },
  {
    id: 'Q2',
    text: '别人觉得你的整体色彩 / 质感更接近？',
    options: [
      { id: 'A', text: '干净通透，清清爽爽、不拖泥带水' },
      { id: 'B', text: '浓墨重彩、对比强烈，存在感拉满' },
      { id: 'C', text: '柔和温软，自带治愈感和回甘' },
      { id: 'D', text: '冷淡克制、低饱和，带点疏离的高级感' },
      { id: 'E', text: '明亮鲜活、阳光满满，热烈又外放' },
    ],
  },
  {
    id: 'Q3',
    text: '别人对你的「性格印象」通常是？',
    options: [
      { id: 'A', text: '热情好客、接地气，跟谁都能聊到一起' },
      { id: 'B', text: '克制讲究，喜欢留白和分寸感' },
      { id: 'C', text: '复古念旧，偏爱有故事、有沉淀的东西' },
      { id: 'D', text: '清爽干净，自带一股青草味和少年 / 少女气' },
      { id: 'E', text: '儒雅内敛，有点书卷气和东方韵味' },
      { id: 'F', text: '成熟有气场，魅力藏不住、能掌控全场' },
    ],
  },
  {
    id: 'Q4',
    text: '你最舒服的「待人姿态」是？',
    options: [
      { id: 'A', text: '果断利落、说一不二，行动力 max' },
      { id: 'B', text: '温柔内敛，相处起来如沐春风' },
      { id: 'C', text: '极简清冷，活得通透、不爱凑热闹' },
      { id: 'D', text: '优雅从容、自带贵气，怎么看都精致' },
      { id: 'E', text: '灵动俏皮、有趣，自带无龄少年感' },
      { id: 'F', text: '松弛随性、自由洒脱，怎么舒服怎么来' },
    ],
  },
  {
    id: 'Q5',
    text: '周末更治愈你的是？',
    options: [
      { id: 'A', text: '独自待着，刷剧 / 看书 / 发呆' },
      { id: 'B', text: '跟 1-2 个老朋友安静聚一聚' },
      { id: 'C', text: '出门走走逛逛，看看陌生人' },
      { id: 'D', text: '直接组个局，人越多越上头' },
    ],
  },
  {
    id: 'Q6',
    text: '你更容易被哪种人吸引？',
    options: [
      { id: 'A', text: '安静、有自己世界的人' },
      { id: 'B', text: '谁都能聊得来、自带光的人' },
    ],
  },
  {
    id: 'Q7',
    text: '做选择时，你更相信？',
    options: [
      { id: 'A', text: '当下那股「就是它」的直觉' },
      { id: 'B', text: '心里那点说不清但很确定的感受' },
      { id: 'C', text: '列一列优劣，挑数据更优的那个' },
      { id: 'D', text: '拆解利弊、推演结果，再做决定' },
    ],
  },
  {
    id: 'Q8',
    text: '朋友找你倒苦水，你的第一反应是？',
    options: [
      { id: 'A', text: '先抱抱 ta，陪着就行' },
      { id: 'B', text: '帮 ta 理清楚到底卡在哪里' },
    ],
  },
  {
    id: 'Q9',
    text: '突然多出 2 小时空闲，你会？',
    options: [
      { id: 'A', text: '让自己彻底放空，做什么都行' },
      { id: 'B', text: '随性挑一件想做的小事' },
      { id: 'C', text: '把待办清单往前推一推' },
      { id: 'D', text: '立刻安排满，绝不浪费' },
    ],
  },
  {
    id: 'Q10',
    text: '看到「计划被打乱」，你的心情是？',
    options: [
      { id: 'A', text: '没事，顺势改一改就好' },
      { id: 'B', text: '必须立刻重排，不重排心里不踏实' },
    ],
  },
];

/* 每道题每个选项 → { S: 基酒加票, V: 7维向量增量 } */
const WEIGHTS = {
  Q1: {
    A: { S: { Gin: 2, Tequila: 2 },       V: [1, 0, 0, 0, 0, 0, 0] },
    B: { S: { Vodka: 2, WhiteRum: 2 },     V: [0, 0, 1, 0, 0, 0, 0] },
    C: { S: { Bourbon: 2, AgedRum: 2 },    V: [0, 0, 0, 0, 0, 1, 0] },
    D: { S: { Cognac: 2, DryGin: 2 },      V: [1, 0, 0, 0, 0, 0, 1] },
    E: { S: { Mezcal: 2, Cachaça: 2 },     V: [0, 0, 0, 1, 1, 0, 0] },
  },
  Q2: {
    A: { S: {}, V: [3, 0, 0, 0, 0, 0, 1] },
    B: { S: {}, V: [0, 3, 0, 1, 0, 0, 0] },
    C: { S: {}, V: [0, 0, 3, 0, 0, 0, 0] },
    D: { S: {}, V: [0, 0, 0, 3, 0, 1, 0] },
    E: { S: {}, V: [0, 0, 0, 0, 3, 0, 0] },
  },
  Q3: {
    A: { S: {}, V: [0, 0, 1, 0, 1, 0, 0] },
    B: { S: {}, V: [2, 0, 0, 0, 0, 0, 0] },
    C: { S: {}, V: [0, 1, 0, 0, 0, 2, 0] },
    D: { S: {}, V: [0, 0, 0, 1, 0, 0, 1] },
    E: { S: {}, V: [0, 0, 0, 2, 0, 0, 0] },
    F: { S: {}, V: [0, 2, 0, 0, 0, 0, 0] },
  },
  Q4: {
    A: { S: { Bourbon: 1, AgedRum: 1 },    V: [0, 1, 0, 0, 0, 1, 0] },
    B: { S: { WhiteRum: 1 },               V: [0, 0, 1, 0, 0, 0, 0] },
    C: { S: { DryGin: 1, Vodka: 1 },       V: [2, 0, 0, 0, 0, 0, 0] },
    D: { S: { Cognac: 1 },                 V: [0, 0, 0, 0, 0, 0, 1] },
    E: { S: { Gin: 1 },                    V: [0, 0, 0, 0, 1, 0, 1] },
    F: { S: { Cachaça: 1 },               V: [0, 0, 1, 0, 1, 0, 0] },
  },
};

/* 内在轴权重表（仅作用于 Q5-Q10）
   N 能量取向: -内敛/+外放  ·  J 决策方式: -感性/+理性  ·  P 生活节奏: -松弛/+紧绷 */
const INNER_WEIGHTS = {
  Q5: { A: { N: -2 }, B: { N: -1 }, C: { N: 1 }, D: { N: 2 } },
  Q6: { A: { N: -1 }, B: { N: 1 } },
  Q7: { A: { J: -2 }, B: { J: -1 }, C: { J: 1 }, D: { J: 2 } },
  Q8: { A: { J: -1 }, B: { J: 1 } },
  Q9: { A: { P: -2 }, B: { P: -1 }, C: { P: 1 }, D: { P: 2 } },
  Q10:{ A: { P: -1 }, B: { P: 1 } },
};

/* 基酒同族映射：用于原型筛选时宽松匹配 */
const SPIRIT_FAMILY = {
  Gin:      ['Gin', 'DryGin'],
  DryGin:   ['DryGin', 'Gin'],
  Vodka:    ['Vodka'],
  WhiteRum: ['WhiteRum'],
  Bourbon:  ['Bourbon', 'AgedRum'],
  AgedRum:  ['AgedRum', 'Bourbon'],
  Tequila:  ['Tequila', 'Mezcal'],
  Mezcal:   ['Mezcal', 'Tequila'],
  Cognac:   ['Cognac', 'DryGin'],
  Cachaça:  ['Cachaça'],
};

/* 15 款个性化鸡尾酒原型 */
const PROTOTYPES = [
  {
    id: 1, spirits: ['DryGin', 'Vodka'],
    V: [3, 0, 0, 0, 0, 0, 0],
    name: '手术刀',
    recipe: '极干金酒 60ml · 干味美思 5ml · 柠檬皮油喷雾',
    reason: '一刀见血的清醒，不留余地，也不留遗憾。',
  },
  {
    id: 2, spirits: ['Gin'],
    V: [0, 3, 0, 1, 0, 0, 0],
    name: '木权杖',
    recipe: '金酒 30ml · 红味美思 30ml · 金巴利 30ml · 鲜橙皮',
    reason: '苦得理直气壮，全场都得听你的。',
  },
  {
    id: 3, spirits: ['Gin'],
    V: [1, 0, 0, 0, 0, 0, 2],
    name: '青雾少年',
    recipe: '金酒 50ml · 青柠汁 15ml · 黄瓜片 · 接骨木花糖浆 10ml',
    reason: '像清晨第一口空气，干净到让人想多看两眼。',
  },
  {
    id: 4, spirits: ['Tequila'],
    V: [0, 0, 0, 0, 3, 0, 0],
    name: '龙舌兰烈阳',
    recipe: '龙舌兰 50ml · 青柠汁 20ml · 龙舌兰糖浆 10ml · 盐边',
    reason: '一口下去满是太阳，咸甜都是你的脾气。',
  },
  {
    id: 5, spirits: ['Mezcal'],
    V: [0, 0, 0, 3, 0, 1, 0],
    name: '烟枪诗人',
    recipe: '梅斯卡尔 50ml · 安格斯特拉苦精 2dash · 烟熏方糖 · 橙皮',
    reason: '安静地点一支烟，故事比你想的更深。',
  },
  {
    id: 6, spirits: ['Cachaça'],
    V: [0, 0, 1, 0, 2, 0, 0],
    name: '丛林鼓点',
    recipe: '卡莎夏 50ml · 百香果汁 30ml · 青柠汁 15ml · 蔗糖 10ml',
    reason: '一开口就是热带的节奏，谁都跟着你晃。',
  },
  {
    id: 7, spirits: ['Vodka'],
    V: [2, 0, 0, 0, 0, 0, 1],
    name: '月光绸缎',
    recipe: '伏特加 50ml · 干味美思 10ml · 柠檬皮油',
    reason: '冷得有质感，靠近才知道有多顺滑。',
  },
  {
    id: 8, spirits: ['Vodka'],
    V: [0, 0, 3, 0, 0, 0, 0],
    name: '蜜桃绒',
    recipe: '伏特加 40ml · 水蜜桃利口酒 20ml · 鲜柠檬汁 10ml · 少许荔枝糖浆',
    reason: '软软糯糯，治愈系长在你脸上。',
  },
  {
    id: 9, spirits: ['WhiteRum'],
    V: [0, 0, 3, 0, 1, 0, 0],
    name: '奶云朵',
    recipe: '白朗姆 50ml · 椰浆 30ml · 新鲜菠萝汁 50ml · 少许肉豆蔻',
    reason: '慵懒到骨子里，像泡在度假的午后。',
  },
  {
    id: 10, spirits: ['WhiteRum'],
    V: [0, 0, 0, 0, 1, 0, 3],
    name: '薄荷晨露',
    recipe: '白朗姆 50ml · 新鲜薄荷叶 · 青柠汁 20ml · 苏打水补满',
    reason: '清爽得冒泡，自带阳光和好心情。',
  },
  {
    id: 11, spirits: ['Bourbon'],
    V: [0, 0, 0, 0, 0, 3, 0],
    name: '焦糖老唱片',
    recipe: '波本威士忌 50ml · 安格斯特拉苦精 2dash · 方糖 1颗 · 橙皮',
    reason: '旧旧的、暖暖的，越品越上头。',
  },
  {
    id: 12, spirits: ['Bourbon', 'AgedRum'],
    V: [0, 2, 0, 0, 0, 2, 0],
    name: '红丝绒夫人',
    recipe: '黑麦威士忌 50ml · 甜苦艾酒 20ml · 安格斯特拉苦精 1dash · 腌渍樱桃',
    reason: '浓得像一场不动声色的较量，赢家是你。',
  },
  {
    id: 13, spirits: ['AgedRum'],
    V: [0, 0, 0, 0, 1, 2, 0],
    name: '朗姆篝火',
    recipe: '陈年朗姆 50ml · 杏仁糖浆 15ml · 青柠汁 15ml · 鲜橙皮',
    reason: '热烈又厚重，篝火旁最迷人的那个人。',
  },
  {
    id: 14, spirits: ['Cognac'],
    V: [0, 0, 0, 1, 0, 0, 2],
    name: '干邑薄纱',
    recipe: '干邑 30ml · 鲜柠檬汁 15ml · 糖浆 10ml · 香槟补满',
    reason: '优雅是天生的，连气泡都替你说话。',
  },
  {
    id: 15, spirits: ['DryGin', 'Cognac'],
    V: [1, 0, 0, 0, 0, 0, 3],
    name: '香槟碎钻',
    recipe: '金酒 30ml · 鲜柠檬汁 15ml · 糖浆 10ml · 香槟补满',
    reason: '闪着光地出场，贵气藏不住。',
  },
];

/* 15 款经典鸡尾酒（使用非白底图片） */
const CLASSICS = [
  { id: 1,  name: '干马天尼',     V: [3, 0, 0, 0, 0, 0, 0], img: '干马天尼.jpg',     reason: '你这股清醒劲儿，点它准没错。' },
  { id: 2,  name: '尼格罗尼',     V: [0, 2, 0, 2, 0, 0, 0], img: '尼格罗尼.jpg',     reason: '重口又有气场，刚好接得住你。' },
  { id: 3,  name: '吉姆雷特',     V: [2, 0, 0, 0, 0, 0, 1], img: '吉姆雷特.jpg',     reason: '干净又锋利，和你一个调性。' },
  { id: 4,  name: '玛格丽特',     V: [2, 0, 0, 0, 2, 0, 0], img: '玛格丽特.jpg',     reason: '酸甜带劲，跟你一样爱晒太阳。' },
  { id: 5,  name: '梅斯卡尔古典', V: [0, 0, 0, 2, 0, 1, 0], img: '梅斯卡尔古典.jpg', reason: '带点烟熏故事感，懂的人才懂。' },
  { id: 6,  name: '迈泰',         V: [0, 0, 0, 0, 2, 1, 0], img: '迈泰.jpg',         reason: '热烈又有层次，配你的野劲儿。' },
  { id: 7,  name: '大都会',       V: [0, 0, 1, 0, 2, 0, 0], img: '大都会.jpg',       reason: '又飒又精致，气场全在杯里。' },
  { id: 8,  name: '莫斯科骡子',   V: [0, 0, 0, 0, 1, 0, 2], img: '莫斯科骡子.jpg',   reason: '清爽不端着，跟你一样好相处。' },
  { id: 9,  name: '椰林飘香',     V: [0, 0, 3, 0, 0, 0, 0], img: '椰林飘香.jpg',     reason: '甜软又松弛，度假感写脸上。' },
  { id: 10, name: '莫吉托',       V: [0, 0, 0, 1, 0, 0, 2], img: '莫吉托.jpg',       reason: '清新冒泡，少年气满分。' },
  { id: 11, name: '古典',         V: [0, 1, 0, 0, 0, 3, 0], img: '古典.jpg',         reason: '越品越有味，复古得刚刚好。' },
  { id: 12, name: '曼哈顿',       V: [0, 2, 0, 0, 0, 2, 0], img: '曼哈顿.jpg',       reason: '浓而不闹，成熟魅力靠它。' },
  { id: 13, name: '威士忌酸',     V: [0, 0, 1, 0, 1, 0, 0], img: '威士忌酸.jpg',     reason: '酸甜温柔，谁喝都上头。' },
  { id: 14, name: '阿佩罗气泡',   V: [0, 0, 0, 0, 2, 0, 2], img: '阿佩罗气泡.jpg',   reason: '明亮松弛，自带好天气。' },
  { id: 15, name: '法兰西75',     V: [1, 0, 0, 0, 0, 0, 3], img: '法兰西75.jpg',     reason: '带气泡的优雅，贵气藏不住。' },
];

/* 8 个内在人格原型
   axis: 在 N/J/P 三轴上的「定位向量」，取值 -1/0/+1（与用户量化后的轴对齐）
   prototypes: 与该人格调性相符的特调 id 列表（用于和外在 top3 候选取交集） */
const PERSONALITIES = [
  { id: 1, name: '冷峻执剑者',  axis: { N: -1, J: 1,  P: 1  }, tagline: '沉默是最锋利的回答',          prototypes: [1, 7]  },
  { id: 2, name: '掌控魅惑者',  axis: { N: 1,  J: 1,  P: 1  }, tagline: '你笑着，但全场都听你的',      prototypes: [2, 12] },
  { id: 3, name: '温柔治愈者',  axis: { N: -1, J: -1, P: -1 }, tagline: '慢慢的，但所有人都靠你充电',  prototypes: [8, 9]  },
  { id: 4, name: '野性燃烧者',  axis: { N: 1,  J: -1, P: 1  }, tagline: '一靠近就让人心跳过速',        prototypes: [4, 13] },
  { id: 5, name: '疏离诗人',    axis: { N: -1, J: -1, P: 1  }, tagline: '安静地藏好故事，等人来读',    prototypes: [5, 14] },
  { id: 6, name: '少年清风',    axis: { N: 1,  J: -1, P: -1 }, tagline: '没心机，但每一阵风都有阳光味', prototypes: [3, 10] },
  { id: 7, name: '沉淀念旧者',  axis: { N: -1, J: 1,  P: -1 }, tagline: '用一杯酒打开一段过往',        prototypes: [11]    },
  { id: 8, name: '闪耀松弛者',  axis: { N: 1,  J: 1,  P: -1 }, tagline: '贵气从骨子里漫出来，毫不费力', prototypes: [6, 15] },
];

/* 7 维向量的中文外在轮廓短语（用于融合句拼接） */
const EXTERNAL_LABELS = [
  '锐利干冽',  // D1
  '浓郁苦韵',  // D2
  '甜润乳脂',  // D3
  '草本木质',  // D4
  '热带果爆',  // D5
  '厚重陈香',  // D6
  '轻盈气泡',  // D7
];


/* ================================================================
   工 具 函 数
   ================================================================ */

function vecAdd(a, b) {
  return a.map(function (v, i) { return v + b[i]; });
}

function vecNorm(v) {
  var mag = Math.sqrt(v.reduce(function (s, x) { return s + x * x; }, 0));
  if (mag === 0) {
    var n = v.length;
    return v.map(function () { return 1 / Math.sqrt(n); });
  }
  return v.map(function (x) { return x / mag; });
}

function cosineSim(a, b) {
  var dot = a.reduce(function (s, x, i) { return s + x * b[i]; }, 0);
  var ma  = Math.sqrt(a.reduce(function (s, x) { return s + x * x; }, 0));
  var mb  = Math.sqrt(b.reduce(function (s, x) { return s + x * x; }, 0));
  if (ma === 0 || mb === 0) return 0;
  return dot / (ma * mb);
}


/* ================================================================
   计 算 结 果
   ================================================================ */

function calcResult(answers) {
  var S = {};
  var V = [0, 0, 0, 0, 0, 0, 0];

  ['Q1', 'Q2', 'Q3', 'Q4'].forEach(function (qId) {
    var opt = answers[qId];
    if (!opt) return;
    var w = WEIGHTS[qId][opt];
    if (!w) return;
    Object.keys(w.S).forEach(function (sp) {
      S[sp] = (S[sp] || 0) + w.S[sp];
    });
    V = vecAdd(V, w.V);
  });

  /* 赢票基酒（并列时按 Q1 选项顺序优先） */
  var spiritOrder = ['Gin', 'Tequila', 'Vodka', 'WhiteRum', 'Bourbon',
                     'AgedRum', 'Cognac', 'DryGin', 'Mezcal', 'Cachaça'];
  var winSpirit = 'Gin';
  var maxVotes  = -1;
  spiritOrder.forEach(function (sp) {
    var votes = S[sp] || 0;
    if (votes > maxVotes) { maxVotes = votes; winSpirit = sp; }
  });

  var Vn = vecNorm(V);

  /* 匹配个性化原型（同族基酒优先 → 余弦最近，保留 top 3 候选） */
  var family     = SPIRIT_FAMILY[winSpirit] || [winSpirit];
  var candidates = PROTOTYPES.filter(function (p) {
    return p.spirits.some(function (s) { return family.indexOf(s) >= 0; });
  });
  if (candidates.length === 0) candidates = PROTOTYPES.slice();

  var ranked = candidates.map(function (p) {
    return { p: p, sim: cosineSim(Vn, vecNorm(p.V)) };
  }).sort(function (a, b) { return b.sim - a.sim; });
  var top3 = ranked.slice(0, 3).map(function (r) { return r.p; });

  /* 累加内在轴（Q5-Q10） */
  var axis = { N: 0, J: 0, P: 0 };
  ['Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'].forEach(function (qId) {
    var opt = answers[qId];
    if (!opt) return;
    var w = INNER_WEIGHTS[qId][opt];
    if (!w) return;
    Object.keys(w).forEach(function (k) { axis[k] += w[k]; });
  });

  /* 量化到 -1 / 0 / +1 */
  var quantized = {
    N: axis.N <= -1 ? -1 : axis.N >= 1 ? 1 : 0,
    J: axis.J <= -1 ? -1 : axis.J >= 1 ? 1 : 0,
    P: axis.P <= -1 ? -1 : axis.P >= 1 ? 1 : 0,
  };

  /* 最近人格（曼哈顿距离，并列时按 id 序号取小） */
  var personality = PERSONALITIES.reduce(function (best, persona) {
    var d = Math.abs(persona.axis.N - quantized.N)
          + Math.abs(persona.axis.J - quantized.J)
          + Math.abs(persona.axis.P - quantized.P);
    if (d < best.d) return { p: persona, d: d };
    return best;
  }, { p: PERSONALITIES[0], d: Infinity }).p;

  /* 取交集：top3 中第一个落在该人格 prototypes 列表里的，否则退回 top1 */
  var custom = null;
  for (var i = 0; i < top3.length; i++) {
    if (personality.prototypes.indexOf(top3[i].id) >= 0) { custom = top3[i]; break; }
  }
  if (!custom) custom = top3[0];

  /* 匹配经典鸡尾酒（独立余弦最近邻，不受人格影响） */
  var classic = CLASSICS.reduce(function (best, c) {
    var sim = cosineSim(Vn, vecNorm(c.V));
    return sim > best.sim ? { c: c, sim: sim } : best;
  }, { c: CLASSICS[0], sim: -Infinity }).c;

  /* 融合句：外在 top-2 维度短语 + 内在标签 */
  var fusion = composeReason(V, personality);

  return { custom: custom, classic: classic, personality: personality, fusion: fusion };
}

/* 生成「外在轮廓 + 内在标签 + 融合句」推荐理由
   externalV: 7 维原始向量 V；persona: 命中的人格对象 */
function composeReason(externalV, persona) {
  /* 取 V 的 top 2 维度，拼成「A 与 B」的外在描述 */
  var indexed = externalV.map(function (v, i) { return { v: v, i: i }; });
  indexed.sort(function (a, b) { return b.v - a.v; });
  var top = indexed.filter(function (x) { return x.v > 0; }).slice(0, 2);

  var external;
  if (top.length === 0) {
    external = '说不清的轮廓';
  } else if (top.length === 1) {
    external = EXTERNAL_LABELS[top[0].i];
  } else {
    external = EXTERNAL_LABELS[top[0].i] + '混着' + EXTERNAL_LABELS[top[1].i];
  }

  return external + '的轮廓，' + persona.tagline + ' —— 这一杯，是为你调的。';
}


/* ================================================================
   状 态
   ================================================================ */

var currentQ = 0;
var answers  = {};


/* ================================================================
   UI 渲 染
   ================================================================ */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });
  var el = document.getElementById(id);
  el.classList.add('active');
  el.scrollTop = 0;
  window.scrollTo(0, 0);
}

/* 切换题目（带入/出动画） */
function renderQuestion(idx, dir) {
  var q   = QUESTIONS[idx];
  var wrap = document.getElementById('question-wrap');

  /* 淡出 */
  wrap.style.cssText = 'opacity:0; transform:translateX(' +
    (dir === 'back' ? '0.2rem' : '-0.2rem') + '); transition:opacity 0.15s,transform 0.15s;';

  setTimeout(function () {
    /* 重建 DOM */
    wrap.innerHTML = '';

    var qtEl = document.createElement('p');
    qtEl.className = 'question-text';
    qtEl.textContent = q.text;
    wrap.appendChild(qtEl);

    var listEl = document.createElement('div');
    listEl.className = 'option-list';

    q.options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.className = 'option-btn' + (answers[q.id] === opt.id ? ' selected' : '');
      btn.setAttribute('data-opt', opt.id);
      btn.setAttribute('type', 'button');

      var letterEl = document.createElement('span');
      letterEl.className = 'option-letter';
      letterEl.textContent = opt.id;

      var textEl = document.createElement('span');
      textEl.className = 'option-text';
      textEl.textContent = opt.text;

      btn.appendChild(letterEl);
      btn.appendChild(textEl);

      btn.addEventListener('click', function () { selectOption(q.id, opt.id); });
      listEl.appendChild(btn);
    });

    wrap.appendChild(listEl);

    /* 进度 */
    document.getElementById('quiz-progress-fill').style.width =
      ((idx + 1) / QUESTIONS.length * 100) + '%';
    document.getElementById('quiz-step-label').textContent =
      (idx + 1) + ' / ' + QUESTIONS.length;

    /* 按钮状态 */
    var prevBtn = document.getElementById('btn-prev');
    var nextBtn = document.getElementById('btn-next');
    prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
    nextBtn.disabled         = !answers[q.id];
    nextBtn.textContent      = idx === QUESTIONS.length - 1 ? '生成我的鸡尾酒' : '下一题';

    /* 淡入 */
    var fromX = dir === 'back' ? '-0.2rem' : '0.2rem';
    wrap.style.cssText = 'opacity:0; transform:translateX(' + fromX + '); transition:none;';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wrap.style.cssText =
          'opacity:1; transform:translateX(0); transition:opacity 0.25s,transform 0.25s;';
      });
    });
  }, 160);
}

function selectOption(qId, optId) {
  answers[qId] = optId;
  document.querySelectorAll('.option-btn').forEach(function (btn) {
    var isSelected = btn.getAttribute('data-opt') === optId;
    btn.classList.toggle('selected', isSelected);
  });
  document.getElementById('btn-next').disabled = false;
}

/* 渲染结果页 */
function renderResult(custom, classic, personality, fusion) {
  /* ── 专属特调卡 ── */
  var customCard = document.getElementById('result-custom-card');
  customCard.innerHTML = '';

  var lbl = document.createElement('div');
  lbl.className = 'card-section-label';
  lbl.textContent = '你的专属特调';

  /* 人格名 + 融合句（写在鸡尾酒名上方，作为推荐理由） */
  var personaEl = document.createElement('div');
  personaEl.className = 'persona-name';
  personaEl.textContent = personality.name;

  var fusionEl = document.createElement('div');
  fusionEl.className = 'fusion-line';
  fusionEl.textContent = fusion;

  var nameEl = document.createElement('div');
  nameEl.className = 'custom-name';
  nameEl.textContent = custom.name;

  var rule1 = document.createElement('div');
  rule1.className = 'recipe-rule';

  var recipeEl = document.createElement('ul');
  recipeEl.className = 'recipe-list';
  custom.recipe.split(' · ').forEach(function (item) {
    var li = document.createElement('li');
    li.textContent = item;
    recipeEl.appendChild(li);
  });

  var rule2 = document.createElement('div');
  rule2.className = 'recipe-rule';

  var reasonEl = document.createElement('div');
  reasonEl.className = 'custom-reason';
  reasonEl.textContent = '\u201c' + custom.reason + '\u201d';

  [lbl, personaEl, fusionEl, nameEl, rule1, recipeEl, rule2, reasonEl].forEach(function (el) {
    customCard.appendChild(el);
  });

  /* ── 经典平替卡 ── */
  var classicCard = document.getElementById('result-classic-card');
  classicCard.innerHTML = '';

  var clbl = document.createElement('div');
  clbl.className = 'card-section-label';
  clbl.textContent = '经典平替';

  var frameEl = document.createElement('div');
  frameEl.className = 'classic-img-frame';

  var imgEl = document.createElement('img');
  imgEl.src     = './image/' + classic.img;
  imgEl.alt     = classic.name;
  imgEl.loading = 'lazy';
  frameEl.appendChild(imgEl);

  var cnameEl = document.createElement('div');
  cnameEl.className = 'classic-name';
  cnameEl.textContent = classic.name;

  var creasonEl = document.createElement('div');
  creasonEl.className = 'classic-reason';
  creasonEl.textContent = classic.reason;

  [clbl, frameEl, cnameEl, creasonEl].forEach(function (el) {
    classicCard.appendChild(el);
  });
}


/* ================================================================
   事 件 绑 定
   ================================================================ */

document.getElementById('btn-start').addEventListener('click', function () {
  currentQ = 0;
  answers  = {};
  showScreen('screen-quiz');
  renderQuestion(0, 'forward');
});

document.getElementById('btn-next').addEventListener('click', function () {
  var q = QUESTIONS[currentQ];
  if (!answers[q.id]) return;

  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion(currentQ, 'forward');
  } else {
    /* 最后一题 → 显示加载动画 → 计算 → 结果 */
    var wrap = document.getElementById('question-wrap');
    wrap.innerHTML = '';

    var loadingEl = document.createElement('div');
    loadingEl.className = 'loading-state';

    var dotsEl = document.createElement('div');
    dotsEl.className = 'loading-dots';
    [0, 1, 2].forEach(function () {
      dotsEl.appendChild(document.createElement('span'));
    });

    var msgEl = document.createElement('p');
    msgEl.className = 'loading-msg';
    msgEl.textContent = '正在为你调制...';

    loadingEl.appendChild(dotsEl);
    loadingEl.appendChild(msgEl);
    wrap.appendChild(loadingEl);

    document.getElementById('btn-prev').style.visibility = 'hidden';
    document.getElementById('btn-next').style.visibility = 'hidden';

    setTimeout(function () {
      var result = calcResult(answers);
      renderResult(result.custom, result.classic, result.personality, result.fusion);
      showScreen('screen-result');
    }, 1400);
  }
});

document.getElementById('btn-prev').addEventListener('click', function () {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion(currentQ, 'back');
  }
});

document.getElementById('btn-retry').addEventListener('click', function () {
  currentQ = 0;
  answers  = {};
  showScreen('screen-start');
});

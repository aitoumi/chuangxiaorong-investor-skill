'use strict';

/**
 * 创小融 - 创业项目模拟数据
 * Chuangxiaorong mock startup project data for development and testing
 */

const projects = [
  {
    id: 'proj_001',
    name: '智能供应链优化平台',
    company: '链智科技有限公司',
    industry: '企业服务',
    stage: 'A轮',
    fundingAmount: 20000000,
    fundingCurrency: 'RMB',
    description:
      '利用AI和大数据技术优化供应链管理，帮助制造业企业降低库存成本20%以上，提升交付效率。已与50+家制造企业合作，ARR超过500万元。',
    founded: '2022',
    location: '上海',
    teamSize: 35,
    annualRevenue: 5000000,
    tags: ['AI', 'SaaS', '供应链', 'B2B'],
    contact: {
      name: '张明',
      title: 'CEO',
      email: 'zhang.ming@lianzhi.tech',
    },
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'proj_002',
    name: '医疗影像AI辅助诊断系统',
    company: '影智医疗科技',
    industry: '医疗健康',
    stage: 'B轮',
    fundingAmount: 80000000,
    fundingCurrency: 'RMB',
    description:
      '基于深度学习的医疗影像分析平台，覆盖肺癌、糖网、骨龄等多个病种，诊断准确率达95%以上。已获NMPA认证，接入200+家医院。',
    founded: '2020',
    location: '北京',
    teamSize: 120,
    annualRevenue: 30000000,
    tags: ['AI', '医疗', '影像', 'DeepTech'],
    contact: {
      name: '李华',
      title: 'CEO',
      email: 'li.hua@yingzhi-med.com',
    },
    status: 'active',
    createdAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'proj_003',
    name: '新能源汽车电池回收与梯次利用',
    company: '绿循能源科技',
    industry: '新能源',
    stage: 'Pre-A轮',
    fundingAmount: 10000000,
    fundingCurrency: 'RMB',
    description:
      '专注于动力电池全生命周期管理，包括梯次利用和再生回收。已建立5个省级回收网络，年处理电池1000吨以上，与主流车企建立战略合作。',
    founded: '2023',
    location: '深圳',
    teamSize: 20,
    annualRevenue: 2000000,
    tags: ['新能源', '碳中和', '循环经济', '双碳'],
    contact: {
      name: '王芳',
      title: 'CEO',
      email: 'wang.fang@lvxun-energy.com',
    },
    status: 'active',
    createdAt: '2024-03-10T08:00:00Z',
  },
  {
    id: 'proj_004',
    name: '跨境电商智能选品与运营SaaS',
    company: '出海云',
    industry: '跨境电商',
    stage: '天使轮',
    fundingAmount: 5000000,
    fundingCurrency: 'RMB',
    description:
      '基于大数据和AI的跨境电商选品工具，帮助中小卖家精准选品、优化广告投放，平均提升GMV 40%。平台已服务5000+卖家，月活跃用户增长30%。',
    founded: '2023',
    location: '杭州',
    teamSize: 15,
    annualRevenue: 800000,
    tags: ['SaaS', '跨境电商', 'AI', '出海'],
    contact: {
      name: '陈伟',
      title: 'CEO',
      email: 'chen.wei@chuhai-cloud.com',
    },
    status: 'active',
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'proj_005',
    name: '工业机器人自动化改造方案',
    company: '智造未来科技',
    industry: '智能制造',
    stage: 'A轮',
    fundingAmount: 30000000,
    fundingCurrency: 'RMB',
    description:
      '提供轻量化工业机器人部署方案，6个月内完成中小制造厂智能化改造，投资回收周期18个月以内。已完成100+工厂改造项目，复购率超过70%。',
    founded: '2021',
    location: '苏州',
    teamSize: 60,
    annualRevenue: 15000000,
    tags: ['机器人', '智能制造', '工业互联网', '硬科技'],
    contact: {
      name: '刘强',
      title: 'CEO',
      email: 'liu.qiang@zhizao-future.com',
    },
    status: 'active',
    createdAt: '2024-02-15T08:00:00Z',
  },
  {
    id: 'proj_006',
    name: '在线职业技能培训平台',
    company: '技能星球',
    industry: '教育科技',
    stage: 'B轮',
    fundingAmount: 60000000,
    fundingCurrency: 'RMB',
    description:
      '聚焦职场技能提升的在线教育平台，覆盖数字营销、数据分析、产品设计等热门方向。注册用户200万+，付费转化率15%，年营收超5000万元。',
    founded: '2019',
    location: '北京',
    teamSize: 200,
    annualRevenue: 50000000,
    tags: ['教育', 'EdTech', '职业培训', 'ToC'],
    contact: {
      name: '孙丽',
      title: 'CEO',
      email: 'sun.li@jinengxingqiu.com',
    },
    status: 'active',
    createdAt: '2024-03-01T08:00:00Z',
  },
  {
    id: 'proj_007',
    name: '农业数字化管理平台',
    company: '农智云',
    industry: '农业科技',
    stage: 'Pre-A轮',
    fundingAmount: 8000000,
    fundingCurrency: 'RMB',
    description:
      '为农业合作社和大型农场提供数字化种植管理方案，集成物联网传感器、无人机巡检和AI病虫害识别，帮助农户减少农药使用30%，提升产量15%。',
    founded: '2022',
    location: '成都',
    teamSize: 25,
    annualRevenue: 3000000,
    tags: ['农业科技', 'AgTech', 'IoT', '乡村振兴'],
    contact: {
      name: '赵磊',
      title: 'CEO',
      email: 'zhao.lei@nongzhi-cloud.com',
    },
    status: 'active',
    createdAt: '2024-04-01T08:00:00Z',
  },
  {
    id: 'proj_008',
    name: '企业级网络安全解决方案',
    company: '盾牌安全科技',
    industry: '网络安全',
    stage: 'C轮',
    fundingAmount: 200000000,
    fundingCurrency: 'RMB',
    description:
      '提供端到端企业网络安全解决方案，涵盖零信任架构、威胁情报分析和数据防泄漏。已服务500+大型企业和政府客户，年营收超2亿元，连续3年增长50%+。',
    founded: '2018',
    location: '北京',
    teamSize: 400,
    annualRevenue: 200000000,
    tags: ['网络安全', 'SaaS', '零信任', 'B2G'],
    contact: {
      name: '吴博',
      title: 'CEO',
      email: 'wu.bo@dunpai-security.com',
    },
    status: 'active',
    createdAt: '2024-01-05T08:00:00Z',
  },
];

/**
 * Valid industries for filtering
 */
const VALID_INDUSTRIES = [
  '企业服务',
  '医疗健康',
  '新能源',
  '跨境电商',
  '智能制造',
  '教育科技',
  '农业科技',
  '网络安全',
  '消费',
  '金融科技',
  '文化娱乐',
  '物流',
];

/**
 * Valid funding stages
 */
const VALID_STAGES = [
  '种子轮',
  '天使轮',
  'Pre-A轮',
  'A轮',
  'A+轮',
  'B轮',
  'B+轮',
  'C轮',
  'C+轮',
  'D轮',
  'Pre-IPO',
  'IPO',
];

module.exports = { projects, VALID_INDUSTRIES, VALID_STAGES };

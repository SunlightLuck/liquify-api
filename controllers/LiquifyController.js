const apis = require('../graphql/poktscan/');

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time))
}

const setHomeData = async (addresses) => {
  const monthReport = await apis.getRewardsReport(28 * 24 * 60 * 60 * 1000, -1, addresses);
  const price = await apis.getPrice();
  const daySummary = await apis.getNodeRunnerSummary(addresses);
  const dayReport = await apis.getRewardsReport(24 * 60 * 60 * 1000, -1, addresses);
  const deployed = await addresses.map(ad => apis.getNode(ad)).reduce((total, num) => ({balance: total.balance + num.balance, tokens: total.tokens + num.tokens}), {balance: 0, tokens: 0});
  // const relayChart = [];
  // for (let index = 0; index < 24; index ++) {
  //   const relay = await apis.getRewardsReport((24 - index) * 60 * 60 * 1000, 60 *60 *1000, addresses);
  //   console.log(relay.total_relays);
  //   await delay(2500);
  //   relayChart[index] = relay.total_relays;
  // }
  const homeData = {
    rewards: monthReport.total_rewards,
    price,
    dayPerformance: daySummary.total_last_24_hours / (daySummary.total_last_48_hours - daySummary.total_last_24_hours),
    dayRelay: dayReport.total_relays,
    dayPokt: dayReport.total_net_tokens,
    monthRelay: monthReport.total_relays,
    monthPokt: monthReport.total_net_tokens,
    deployStaked: deployed.balance,
    deployTotal: deployed.tokens,
//    relayChart
  }
  return homeData;
}

module.exports = setHomeData;
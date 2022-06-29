const {GraphQLClient} = require('graphql-request')
const axios = require('axios');
const {endpoint} = require('../../config/keys');

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: process.env.API_KEY,
  }
})

const dateToString = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;

const getRewardsReport = async (before, period, addresses) => {
  const curTime = new Date();
  let query = `
    query ($from: String!, $to: String!, $addresses: [String!]) {
      getRewardsReport(from: $from, to: $to, addresses: $addresses) {
        total_fee
        total_relays
        total_rewards
        total_net_tokens
        total_producers
        total_producer_tokens
      }
    }
  `
  const variables = {
    from: dateToString(new Date(curTime.getTime() - before)),
    to: period === -1 ? dateToString(curTime) : dateToString(new Date(curTime.getTime() - before + period)),
    addresses: addresses,
  }
  let data = await graphQLClient.request(query, variables)
  return data.getRewardsReport;
}

const getNodeRunnerSummary = async (addresses) => {
  let query = `
    query ($addresses: [String!]) {
      getNodeRunnerSummary(addresses: $addresses) {
        total_last_48_hours
        total_last_24_hours
        total_last_6_hours
        avg_last_48_hours
        avg_last_24_hours
        avg_last_6_hours
      }
    }
  `
  const variables = {
    addresses: addresses
  }
  let data = await graphQLClient.request(query, variables)
  return data.getNodeRunnerSummary;
}

const getNode = async (address) => {
  let query = `
    query ($address: ID!) {
      getNode(address: $address) {
        balance
        tokens
      }
    }
  `
  const variables = {
    address
  }
  let data = await graphQLClient.request(query, variables);
  return data.getNode;
}

const getPrice = async () => {
  const data = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=pocket-network&vs_currencies=usd');
  return data.data['pocket-network'].usd;
}

module.exports = {getRewardsReport, getNodeRunnerSummary, getNode, getPrice};
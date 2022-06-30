const {gql} = require('apollo-server-express')
const mongoose = require('mongoose');
const UserModel = mongoose.model('users');
const setHomeData = require('../../controllers/LiquifyController');

const typeDefs = gql`
  type Query {
    getTest(str: String!): [String!],
    signin(email: String!, password: String!): User!,
    googleSignin(email: String!): User!,
    getMonthlyRewards(email: String!): MonthlyRewards!
  }

  type Mutation {
    signup(userInput: UserInput!): User!,
    addAddress(addressInput: AddressInput!): String!,
    setMonthlyRewards(email:String!, montlyRewards: [DailyRewardInput!]): String!
  }

  type DailyReward {
    date: String!,
    reward: Float!
  }

  type MonthlyRewards {
    montlyRewards: [DailyReward!]
  }

  type User {
    _id: ID!
    firstName: String!,
    lastName: String!,
    email: String!,
    phone: String!,
    addresses: [String!],
  }

  type HomeData {
    rewards: Float!,
    price: Float!,
    dayPerformance: Float!,
    dailyRelay: Float!,
    dailyToken: Float!,
    monthRelay: Float!,
    monthToken: Float!,
    deployedStake: Float!,
    deployedTotal: Float!,
    hourRelays: [Float!]
  }

  input UserInput {
    firstName: String!,
    lastName: String!,
    phone: String!,
    password: String!,
    email: String!
  }

  input AddressInput {
    email: String!,
    address: String!
  }

  input DailyRewardInput {
    date: String!,
    reward: Float!
  }

  input MonthlyRewardsInput {
    montlyRewards: [DailyRewardInput!]
  }
`

const resolvers = {
  Query: {
    getTest: (parent, str) => (
      ["123", "123"]
    ),
    signin: async (parent, {email, password}) => {
      try {
        const user = await UserModel.findOne({email, password});
        if(!user) {
          throw new Error('User does not exist')
        }
        return user;
      } catch(err) {
        throw err;
      }
    },
    googleSignin: async (parent,{email}) => {
      try {
        const user = await UserModel.findOne({email});
        if(!user) {
          throw new Error("User does not exist")
        }
        return user;
      } catch(err) {
        throw err;
      }
    },
    getMonthlyRewards: async (parent, {email}) => {
      try {
        const user = await UserModel.findOne({email})
        if(!user) {
          throw new Error('User does not exist')
        }
        return user.liquifyData.monthlyRewards;
      } catch(err) {
        throw err;
      }
    }
  },
  Mutation: {
    signup: async (parent, {userInput}) => {
      try {
        const user = await UserModel.findOne({email: userInput.email})
        if(user) {
          throw new Error('User already exists')
        }
        const newUser = new UserModel({
          email: userInput.email,
          firstName: userInput.firstName,
          lastName: userInput.lastName,
          password: userInput.password,
          phone: userInput.phone,
          addresses: []
        })
        const savedUser = await newUser.save();
        return savedUser;
      } catch(err) {
        throw err;
      }
    },
    addAddress: async (parent, {addressInput}) => {
      try {
        const user = await UserModel.findOne({email: addressInput.email})
        if(!user) {
          throw new Error('User does not exist')
        }
        user.addresses.push(addressInput.address);
        await user.save();
        return addressInput.address;
      } catch (err) {
        throw err
      }
    },
    setMonthlyRewards: async (parent, {email, monthlyRewards}) => {
      try {
        const user = await UserModel.findOne({email})
        if(!user) {
          throw new Error('User does not exist')
        }
        user.liquifyData.monthlyRewards = monthlyRewards;
        await user.save();
        return 'Success'
      } catch(err) {
        throw err;
      }
    }
  }
}

const schema = {
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  cors: {
    origin: ["http://localhost:3000"]
  },
  context: ({req, res}) => ({req, res})
}

module.exports = schema;
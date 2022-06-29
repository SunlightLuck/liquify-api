const {gql} = require('apollo-server-express')
const mongoose = require('mongoose');
const UserModel = mongoose.model('users');
const setHomeData = require('../../controllers/LiquifyController');

const typeDefs = gql`
  type Query {
    getTest(str: String!): User!,
    signin(email: String!, password: String!): User!,
    googleSignin(email: String!): User!
  }

  type Mutation {
    signup(userInput: UserInput!): User!,
    addAddress(addressInput: AddressInput!): String!
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
`

const resolvers = {
  Query: {
    getTest: (parent, str) => (
      {
        _id: "1",
        firstName: "as",
        lastName: "23",
        email: "12",
        phone: "12",
        addresses: []
      }
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
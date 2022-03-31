const { ApolloServer, UserInputError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let persons = [
    {
        name: 'abbas re',
        phone: '058-3-4245-58',
        street: 'asddsa',
        id: '0',
    },
    {
        name: 'kare re',
        phone: '058-2342-228',
        street: 'gfdsgf',
        id: '1',
    },
    {
        name: 'asdfass re',
        phone: '0584-4352-8',
        street: 'ésgfsgfs',
        id: '2',
    },
    {
        name: 'abbfsgdsf re',
        phone: '05-52345-435',
        street: 'ésfdgss',
        id: '3',
    },
]

const typeDefs = gql`
type Address {
    street:String!
    city:String!
}
type Person {
    name:String!
    phone:String
    address:Address!
    id:ID!
}
type Mutation {
    addPerson(
    name:String!
    phone:String
    street:String!
    city:String!
    ):Person
    editNumber(
    name:String!
    phone:String!
    ):Person
}

enum YesNo {
    Yes
    NO
}
type Query {
    personCount:Int!
    allPersons(phone:YesNo):[Person!]!
    findPerson(name:String!):Person
}
`

const resolvers = {
    Query: {
        personcount: () => persons.length,
        allPersons: (root, args) => {
            if (!args.phone) {
                return persons
            }
            const byPhone = (person) =>
                args.phone === 'YES' ? person.phone : !person.phone
            return persons.filter(byPhone)
        },
        findPerson: (root, args) =>
            persons.find(p => p.name === args.name)
    },
    Person: {
        address: ({ street, city }) => {
            return {
                street,
                city
            }
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            if (PermissionStatus.find(p => p.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invaliArgs: args.name
                })
            }
            const person = { ...args, id: uuid() }
            persons = persons.concat(person)
            return person
        },
        editNumber: (root, args) => {
            const person = persons.find(p => p.name === args.name)
            if (!person) {
                return null
            }
            const updatedPerson = { ...person, phone: args.phone }
            persons = persons.map(p => p.name === args.name ? updatedPerson : p)
            return updatedPerson
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`server ready at ${usrl}`);
})
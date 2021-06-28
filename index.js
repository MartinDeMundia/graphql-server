var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const cors = require('cors');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    visits:[Visits]
    visit(id: ID): Visits 
    keyissues:[KeyIssues]
    keyissue(id: ID):KeyIssues    
    staff:[Staff]
    footfall:[Footfall]
    revenue:[Revenue]   
  }
  type Visits {
    id: ID
    location: String    
  }
  type KeyIssues {
    id: ID
    issue: String  
    location: [Visits] 
  }
  type Staff {
    id: ID
    staff_name: String
    efficiency_d1: String 
    efficiency_d2: String 
    nps_d1: String 
    nps_d2: String
    efficiency: String
    reported_Issues: String         
    location: [Visits] 
  }
  type Footfall {
    id: ID
    name: String
    amnt: String      
  }
  type Revenue {
    id: ID
    name: String
    revenue: String      
  }
`);

const VISITS = new Map()
const KEYISSUES = new Map()
const STAFF = new Map()
const FOOTFALL = new Map()
const REVENUE = new Map()

class Visits {
  constructor (data) { Object.assign(this, data) }
    get visit() {
      return VISITS.get(this.id)
    }
}
class KeyIssues {
  constructor (data) { Object.assign(this, data) }
    get location() {
    return [...VISITS.values()].filter(visit => visit.id === this.visit)
  }
}
class Staff {
  constructor (data) { Object.assign(this, data) }
    get location() {
    return [...VISITS.values()].filter(visit => visit.id === this.visit)
  }
}
class Footfall {
  constructor (data) { Object.assign(this, data) }  
}
class Revenue {
  constructor (data) { Object.assign(this, data) }  
}


const root = {
  visits: () => VISITS.values(),
  visit: ({ id }) => VISITS.get(id),
  keyissues: () => KEYISSUES.values(),
  keyissue: ({ id }) => KEYISSUES.get(id),
  staff: () => STAFF.values(),
  footfall: () => FOOTFALL.values(),
  revenue: () => REVENUE.values()  
}

const initializeData = () => {
 //visits
 const fakeVisits = [
  { id: '7', location: 'Kiambu'},
  { id: '12', location: 'Mukuru Kwa Ruben'},
  { id: '26', location: 'Mukuru Kwa Njenga'},
  { id: '38', location: 'Baba Dogo'},
  { id: '41', location: 'Kosovo'},
  { id: '24', location: 'Mukuru Kayaba'}
]
fakeVisits.forEach(visit => VISITS.set(visit.id, new Visits(visit)))

//keyissues data
const fakeKeyIssues = [
  { id: '1', issue: 'Wrong Prescription' , visit :'41'},
  { id: '2', issue: 'Opened Late' , visit :'7'},
  { id: '3', issue: 'Bad Receipts' , visit :'38'},
  { id: '4', issue: 'Late Check In' , visit :'26'},
  { id: '5', issue: 'Delay In Lab' , visit :'7'},
  { id: '6', issue: 'Careless Waste Disposal' , visit :'7'},
]
fakeKeyIssues.forEach(keyissues => KEYISSUES.set(keyissues.id, new KeyIssues(keyissues)))
//staff data
const fakeStaff = [
  { id: '1', staff_name: 'Mercy Mukoya' , efficiency_d1 :'1,3', efficiency_d2:'+0,2',nps_d1:'1,2',nps_d2:'+0,3', efficiency:'96',reported_Issues:'3',visit :'41'},
  { id: '2', staff_name: 'Kennedy Ayako' , efficiency_d1 :'1,8', efficiency_d2:'+0,4',nps_d1:'1,8',nps_d2:'+0,2', efficiency:'92',reported_Issues:'6', visit :'7'},
  { id: '3', staff_name: 'Stephanie Tomsett' , efficiency_d1 :'2,7', efficiency_d2:'2,5',nps_d1:'2,0',nps_d2:'1,8', efficiency:'58',reported_Issues:'1', visit :'38'},
  { id: '4', staff_name: 'Faith Kityo' , efficiency_d1 :'2,8', efficiency_d2:'-0,5',nps_d1:'2,5',nps_d2:'-2,1', efficiency:'74',reported_Issues:'8', visit :'26'},
 
]
fakeStaff.forEach(staff => STAFF.set(staff.id, new Staff(staff)))
 //footfall
 const fakeFootfall = [
  { id: '1', name: 'JAN' , amnt:'2400'},
  { id: '2', name: 'FEB' , amnt:'1120'},
  { id: '3', name: 'MAR' , amnt:'2209'},
  { id: '4', name: 'APR' , amnt:'2000'},
  { id: '5', name: 'MAY' , amnt:'1600'},
  { id: '6', name: 'JUN' , amnt:'3400'},
  { id: '7', name: 'JUL' , amnt:'2178'},
  { id: '8', name: 'AUG' , amnt:'3200'},
  { id: '9', name: 'SEP' , amnt:'1200'},
  { id: '10', name: 'OCT' , amnt:'1609'},
  { id: '11', name: 'NOV' , amnt:'2300'},
  { id: '12', name: 'DEC' , amnt:'1500'}
]
fakeFootfall.forEach(footfall => FOOTFALL.set(footfall.id, new Footfall(footfall)))

 //revenue
 const fakeRevenue = [
  { id: '1', name: 'JAN' , revenue:'40'},
  { id: '2', name: 'FEB' , revenue:'35'},
  { id: '3', name: 'MAR' , revenue:'11'},
  { id: '4', name: 'APR' , revenue:'17'},
  { id: '5', name: 'MAY' , revenue:'5'},
  { id: '6', name: 'JUN' , revenue:'14'},
  { id: '7', name: 'JUL' , revenue:'21'},
  { id: '8', name: 'AUG' , revenue:'34'},
  { id: '9', name: 'SEP' , revenue:'40'},
  { id: '10', name: 'OCT' , revenue:'29'},
  { id: '11', name: 'NOV' , revenue:'10'},
  { id: '12', name: 'DEC' , revenue:'28'}
]
fakeRevenue.forEach(revenue => REVENUE.set(revenue.id, new Revenue(revenue)))
}

initializeData()

 
var app = express();
app.use("/", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true 
};
app.use(cors(corsOptions));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000');
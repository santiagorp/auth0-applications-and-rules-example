var ManagementClient = require('auth0').ManagementClient;

class appsAndRulesHelper {
  constructor() {
    this.management = null;
  }

  /**
   * Initialize the instance
   * @param {string} domain - The Auth0's user domain
   * @param {string} managementAPIToken - The token for the management API.
   * The token scope should contain at least:
   *
   *  scopes: {
   *    clients: { actions: ['read'] },
   *    rules: { actions: ['read'] },
   *  }
   *
   */
  initialize(domain, managementAPIToken) {
    this.management = new ManagementClient({
      domain: domain,
      token: managementAPIToken
    });
  }

  /**
   * Get a list of all available clients (applications)
   * @param {data} - Data object where the clients should be attached
   * @returns (Promise) - Promise resolving with the clients attached to the data object.
   * If rejected returns the reason in the error message.
   */
  getClients(data) {
    return new Promise((resolve, reject) => {
      this.management.getClients({fields: 'name,client_id'})
      .then(clients => {
        data.clients = clients;
        resolve(data);
      })
      .catch(err => {
        console.log("Error: Retrieving clients");
        console.log(err);
        reject(err);
      });
    });
  }

  /**
   * Get a list of all enabled rules
   * @returns (Promise) - Promise resolving with the rules attached to the data object.
   * If rejected returns the reason in the error message.
   */
  getRules(data) {
    return new Promise((resolve, reject) => {
      this.management.getRules({enabled: true})
      .then(rules => {
        data.rules = rules.sort((a, b) => {
          return a.order - b.order;
        });
        resolve(data);
      })
      .catch(err => {
        console.log("ERROR: Retrieving rules");
        console.log(err);
        reject(err);
      });
    });
  }


  /**
   * Get matching rules for the specified clients
   * @param {array} clients - Array of clients with client_id and name on each element
   * @param {array} rules - Array of rules
   * @returns {array} - Array of application names and rule names
   */
  matchClientsAndRules(clients, rules) {
    let result = clients.map(c => {
      let item = {
        name: c.name,
        id: c.client_id,
        rules: rules.filter(r => {
          let containsFilterRegExp = new RegExp("if\\s*\\(context\\.client(Name|ID)\\s*[!=]==?\\s*['\\\"].*['\\\"]\\s*\\)");
          let isCurrentAppRegExp = new RegExp("(if\\s*\\(context\\.clientName\\s*[!=]==?\\s*['\\\"]" +
            c.name  +"['\\\"]\\s*\\))|(if\\s*\\(context\\.clientID\\s*[!=]==?\\s*['\\\"]" +
            c.client_id +"['\\\"]\\s*\\))");

          let containsFilter = containsFilterRegExp.test(r.script);
          let isCurrentApp = isCurrentAppRegExp.test(r.script);
          let isApplied = !containsFilter || (containsFilter && isCurrentApp);
          return isApplied;
        }).map( r => {
          return r.name;
        })
       };
       return item;
    });
    return result;
  };

  /**
   * Get a list of applications with the rules applied on them
   */
  getClientsAndRules() {
    return new Promise((resolve, reject) => {
      this.getClients({})
      .then(this.getRules.bind(this))
      .then(data => {
        let results = {
          appAndRules: this.matchClientsAndRules(data.clients, data.rules),
          rules: data.rules
        };
        resolve(results);
      })
      .catch(err => {
        console.log("ERROR: Retrieving apps and rules");
        console.log(err);
        reject(err);
      });
    });
  }
}

module.exports = new appsAndRulesHelper();

import React, {Suspense} from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router-dom";
import App from './App';
import * as serviceWorker from './serviceWorker';
import createHistory from "history/createBrowserHistory";
import { onError } from "apollo-link-error";
import { isAuthenticated, unAuthenticate } from "./utils";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, concat } from "apollo-link";
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo-hooks";

const history = createHistory();

const authErrorLink = onError(({ graphQLErrors }) => {
  const hasUnauthorized = graphQLErrors && graphQLErrors.find(error => {
    const { message } = error;
    return message.includes("expired");
  });
  if (hasUnauthorized) {
    unAuthenticate();
    history.push("/login");
  }
});

const cache = new InMemoryCache();

const authMiddleware = new ApolloLink((operation, forward) => {
  if (isAuthenticated()) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
  }
  return forward(operation);
});

const uploadLink = createUploadLink({ uri: "http://0.0.0.0:5000/graphql" });
// const uploadLink = createUploadLink({ uri: "/backend" });

const client = new ApolloClient({
  link: authErrorLink.concat(concat(authMiddleware, uploadLink)),
  cache: cache,
});


/*ReactDOM.render(
  <React>
    <ApolloProvider client={client}>
      <Router history={history}>
        <App />
      </Router>
    </ApolloProvider>
  </React>,
  document.getElementById('root')
);*/

const Main = () => (
  <ApolloProvider client={client}>
    <Router history={history}>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/" component={App} />
        </Suspense>
      </div>
    </Router>
  </ApolloProvider>
);

render(<Main />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

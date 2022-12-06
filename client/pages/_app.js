import "../styles/globals.css";
import "antd/dist/antd.css";
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

function MyApp({ Component, pageProps }) {
  const client = new ApolloClient({
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;

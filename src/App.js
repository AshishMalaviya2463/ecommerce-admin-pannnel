import './App.css';
import Layout from './component/Layout';
import { Route, Switch } from 'react-router-dom'
import Product from './container/Product'

function App() {
  return (
    <>
      <Layout>
        <Switch>
          <Route path='/product' exact component={<Product />} />
        </Switch>
      </Layout>
    </>
  );
}

export default App;

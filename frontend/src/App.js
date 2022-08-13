import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navigation/Navbar';
import Home from './components/Home/Home';
import Register from './components/Users/Register/Register';
import Login from './components/Users/Login/Login';
import CategoryList from './components/Categories/CategoryList';
import AddNewCategory from './components/Categories/AddNewCategory';

function App() {
  return (
    <Router>
      <Navbar />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/category-list" component={CategoryList} />
        <Route exact path="/add-category" component={AddNewCategory} />
      </Switch>
    </Router>
  );
}

export default App;

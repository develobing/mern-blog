import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './Navigation/ProtectedRoutes/PrivateRoute';
import AdminRoute from './Navigation/ProtectedRoutes/AdminRoute';
import Navbar from './Navigation/Navbar';
import Home from './components/Home/Home';
import Register from './components/Users/Register/Register';
import Login from './components/Users/Login/Login';
import CategoryList from './components/Categories/CategoryList';
import AddNewCategory from './components/Categories/AddNewCategory';
import UpdateCategory from './components/Categories/UpdateCategory';
import PostsList from './components/Posts/PostsList';
import CreatePost from './components/Posts/CreatePost';

function App() {
  return (
    <Router>
      <Navbar />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />

        <Route exact path="/posts" component={PostsList} />
        <PrivateRoute exact path="/create-post" component={CreatePost} />

        <AdminRoute exact path="/categories" component={CategoryList} />
        <AdminRoute exact path="/add-category" component={AddNewCategory} />
        <AdminRoute
          exact
          path="/update-category/:_id"
          component={UpdateCategory}
        />
      </Switch>
    </Router>
  );
}

export default App;

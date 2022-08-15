import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './Navigation/ProtectedRoutes/PrivateRoute';
import AdminRoute from './Navigation/ProtectedRoutes/AdminRoute';
import Navbar from './Navigation/Navbar';
import Home from './components/Home/Home';
import Register from './components/Users/Register';
import Login from './components/Users/Login';
import Profile from './components/Users/Profile';
import UpdateProfile from './components/Users/UpdateProfile';
import UploadProfilePhoto from './components/Users/UploadProfilePhoto';
import CategoryList from './components/Categories/CategoryList';
import AddNewCategory from './components/Categories/AddNewCategory';
import UpdateCategory from './components/Categories/UpdateCategory';
import PostsList from './components/Posts/PostsList';
import PostDetails from './components/Posts/PostDetails';
import CreatePost from './components/Posts/CreatePost';
import UpdatePost from './components/Posts/UpdatePost';
import UpdateComment from './components/Comments/UpdateComment';

function App() {
  return (
    <Router>
      <Navbar />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/profile/:_id" component={Profile} />
        <PrivateRoute exact path="/update-profile" component={UpdateProfile} />
        <PrivateRoute
          exact
          path="/upload-profile-photo"
          component={UploadProfilePhoto}
        />

        <Route exact path="/posts" component={PostsList} />
        <Route exact path="/posts/:_id" component={PostDetails} />
        <PrivateRoute exact path="/create-post" component={CreatePost} />
        <PrivateRoute exact path="/update-post/:_id" component={UpdatePost} />
        <PrivateRoute
          exact
          path="/update-comment/:_id"
          component={UpdateComment}
        />

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

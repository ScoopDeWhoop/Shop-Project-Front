import "./Navbar.css";
import myImage from './1.png';
import { Link,useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar({getProducts,loginChange,sum, updateSum}) {
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  
 
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    setUser(null);
    updateSum(0); 
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const userDetails=localStorage.getItem("username")
      
      setUser(userDetails);
    }
  }, [loginChange ]);
  function search(search) {
    getProducts(search);
    navigate("/")
  }
  

  return (
    <>
      <div className="fullnav">
        <div className="headbar">
          <div className="leftSide">
          <Link
                to="/"
                className="nav-item"
                aria-current="page"
                onClick={() => search(null)}
              ><img className="logo" src={myImage} alt="Logo" /></Link>
            <input
              className="searchbar"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            ></input>
            <button
              className="searchbutton"
              type="submit"
              onClick={() => search(searchText)}
            >
              <svg className="svg-icon" viewBox="0 0 20 20">
                <path
                  fill="none"
                  d="M12.323,2.398c-0.741-0.312-1.523-0.472-2.319-0.472c-2.394,0-4.544,1.423-5.476,3.625C3.907,7.013,3.896,8.629,4.49,10.102c0.528,1.304,1.494,2.333,2.72,2.99L5.467,17.33c-0.113,0.273,0.018,0.59,0.292,0.703c0.068,0.027,0.137,0.041,0.206,0.041c0.211,0,0.412-0.127,0.498-0.334l1.74-4.23c0.583,0.186,1.18,0.309,1.795,0.309c2.394,0,4.544-1.424,5.478-3.629C16.755,7.173,15.342,3.68,12.323,2.398z M14.488,9.77c-0.769,1.807-2.529,2.975-4.49,2.975c-0.651,0-1.291-0.131-1.897-0.387c-0.002-0.004-0.002-0.004-0.002-0.004c-0.003,0-0.003,0-0.003,0s0,0,0,0c-1.195-0.508-2.121-1.452-2.607-2.656c-0.489-1.205-0.477-2.53,0.03-3.727c0.764-1.805,2.525-2.969,4.487-2.969c0.651,0,1.292,0.129,1.898,0.386C14.374,4.438,15.533,7.3,14.488,9.77z"
                ></path>
              </svg>
            </button>
          </div>

          <div className="rightSide">
            {user ? (
              <>
                <div className="welcome-message">
                  <div>{user}</div>
                </div>
                <div>
                  <button className="logoutbtn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Link className="registerbtn" to="/register">
                    Register
                  </Link>
                </div>
                <div>
                  <Link className="loginbtn" to="/login">
                    Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <ul className="navbar">
          <div className="navbar-left">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-item"
                aria-current="page"
                onClick={() => search(null)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/nutrition"
                className="nav-item"
                onClick={() => search(null)}
              >
                Nutrition
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/clothing"
                className="nav-item"
                onClick={() => search(null)}
              >
                Clothing
              </Link>
            </li>
          </div>
          <div className="navbar-right">
            <div className="cart-container">
              <li className="cart">
                <Link to="/cart">
                  <svg className="svg-icon" viewBox="0 0 20 20">
                    <path
                      fill="none"
                      d="M17.671,13.945l0.003,0.002l1.708-7.687l-0.008-0.002c0.008-0.033,0.021-0.065,0.021-0.102c0-0.236-0.191-0.428-0.427-0.428H5.276L4.67,3.472L4.665,3.473c-0.053-0.175-0.21-0.306-0.403-0.306H1.032c-0.236,0-0.427,0.191-0.427,0.427c0,0.236,0.191,0.428,0.427,0.428h2.902l2.667,9.945l0,0c0.037,0.119,0.125,0.217,0.239,0.268c-0.16,0.26-0.257,0.562-0.257,0.891c0,0.943,0.765,1.707,1.708,1.707S10,16.068,10,15.125c0-0.312-0.09-0.602-0.237-0.855h4.744c-0.146,0.254-0.237,0.543-0.237,0.855c0,0.943,0.766,1.707,1.708,1.707c0.944,0,1.709-0.764,1.709-1.707c0-0.328-0.097-0.631-0.257-0.891C17.55,14.182,17.639,14.074,17.671,13.945 M15.934,6.583h2.502l-0.38,1.709h-2.312L15.934,6.583zM5.505,6.583h2.832l0.189,1.709H5.963L5.505,6.583z M6.65,10.854L6.192,9.146h2.429l0.19,1.708H6.65z M6.879,11.707h2.027l0.189,1.709H7.338L6.879,11.707z M8.292,15.979c-0.472,0-0.854-0.383-0.854-0.854c0-0.473,0.382-0.855,0.854-0.855s0.854,0.383,0.854,0.855C9.146,15.596,8.763,15.979,8.292,15.979 M11.708,13.416H9.955l-0.189-1.709h1.943V13.416z M11.708,10.854H9.67L9.48,9.146h2.228V10.854z M11.708,8.292H9.386l-0.19-1.709h2.512V8.292z M14.315,13.416h-1.753v-1.709h1.942L14.315,13.416zM14.6,10.854h-2.037V9.146h2.227L14.6,10.854z M14.884,8.292h-2.321V6.583h2.512L14.884,8.292z M15.978,15.979c-0.471,0-0.854-0.383-0.854-0.854c0-0.473,0.383-0.855,0.854-0.855c0.473,0,0.854,0.383,0.854,0.855C16.832,15.596,16.45,15.979,15.978,15.979 M16.917,13.416h-1.743l0.189-1.709h1.934L16.917,13.416z M15.458,10.854l0.19-1.708h2.218l-0.38,1.708H15.458z"
                    ></path>
                  </svg>
                  <div className="cart-number">{sum ?? 0}</div>
                </Link>
              </li>
            </div>
          </div>
        </ul>
      </div>
    </>
  );
}

export default Navbar;

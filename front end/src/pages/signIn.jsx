// src/pages/Profile.jsx

export default function Profile() {
  return (
    // list of user fields for sign in/log in 
    <div class="signIn">
      <h1 style={{paddingBottom: "10px"}}>User sign-in</h1>
       <ul className="profileList">
            <li>
                <input type="text" placeholder="Username" />
            </li>
            <li>
                <input type="text" placeholder="Email"/>
            </li>
            <li>
                <input type="text" placeholder="Password"/>
            </li>
            <li>
                <input type="text" placeholder="Verify password"/>
            </li>
            <li>
                <input type="button" value="Log In" />
            </li>
        </ul>
    </div>
  );
}
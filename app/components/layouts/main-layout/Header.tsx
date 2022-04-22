import { useFetcher, useMatches } from '@remix-run/react';
import { Link } from '@remix-run/react';

function Header() {
  const session = useMatches()[0].data.session;
  const logout = useFetcher();
  console.log(session);
  return (
    <div>
      {session ? (
        <button onClick={() => logout.submit(null, { method: 'post', action: '/logout' })}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export default Header;

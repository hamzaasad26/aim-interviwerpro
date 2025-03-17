import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from 'react-router-dom';

function Navigation() {
  return (
    <nav style = {{background:"#222831"}}
     className="">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 tw-sm:tw-px-6 tw-lg:px-8">
        <div className="tw-flex tw-justify-between tw-h-16">
          <div className="tw-flex-shrink-0 tw-flex tw-items-center">
            <Link to="/" className="tw-text-3xl tw-font-extrabold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-br tw-from-blue-400 tw-to-green-400">
              InterviewerPro
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
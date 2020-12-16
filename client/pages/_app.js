import 'bootstrap/dist/css/bootstrap.css'; 

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    );
};

AppComponent.getInitialProps = async app => {
    const client = buildClient(app.ctx);
    
    const { data } = await client.get("/api/users/current");

    let pageProps = {};

    if (app.Component.getInitialProps) {
        pageProps = await app.Component.getInitialProps(app.ctx);
    }

    return {
        pageProps,
        currentUser: data.currentUser
    };
};

export default AppComponent;
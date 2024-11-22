const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const value = e.target.querySelector('#domoValue').value;

    if (!name || !age || !value) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, value }, onDomoAdded);
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="value">Value: </label>
            <input id="domoValue" type="number" name="value" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    )
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('./getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();

    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoValue">Value: ${domo.value}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const handlePassChange = () => {
    console.log('hi!');
}

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const ChangePasswordForm = () => {
    return (
        <form id="changePassForm"
            name="changePassForm"
            onSubmit={handlePassChange}
            action="/signup"
            method="POST"
            className='mainForm'>
            <label htmlFor="currPass">Current Password:</label>
            <input id="prevPass" type="password" name="prevPass" placeholder="password" />
            <label htmlFor="pass">New Password:</label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">New Password:</label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
    );
}

const init = () => {
    const changePasswordButton = document.getElementById('changePasswordButton');

    const root = createRoot(document.getElementById('app'));

    changePasswordButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<ChangePasswordForm />);
        return false;
    })
    root.render(<App />);
};

window.onload = init;
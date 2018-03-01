import React from 'react';
import Select from 'react-select';
import SignInDetails from './SignInDetails';
import Respondent from '../Respondent';

function toSelectOptions(items) {
    return items.map(item => { return { value: item.identifier, label: item.label} }).sort(item => item.label);
}

export default class RespondentOptionsComponent extends React.Component {
    constructor(props) {
        super(props);

        const { authenticationStatus, respondent, respondentOptions } = props;
        const { departments, roles } = respondentOptions;

        Object.assign(this, { authenticationStatus, departments, roles });

        this.state = { respondent };
    }

    chageRespondent(props) {
        const respondent = this.state.respondent.change(props);
        this.setState({ respondent });
    }

    changeDepartment(item) {
        this.chageRespondent({ department: item && item.value });
    }

    changeRole(item) {
        this.chageRespondent({ role: item && item.value });
    }

    render() {
        const { authenticationStatus, departments, roles } = this;
        const { isSignedIn, user } = authenticationStatus;
        const { respondent } = this.state;

        if (!isSignedIn) {
            return <SignInDetails status={authenticationStatus} />
        }

        return <div>
            <p>
                You are signed in as <strong>{user.label}</strong>
            </p>

            <table>
                <tbody>
                    <tr>
                        <th>Organisation</th><td>{user.organisation.label}</td>
                    </tr>
                    <tr>
                        <th>Department</th>
                        <td>
                            <Select
                                name="respondent-department"
                                clearable={false}
                                value={respondent.department}
                                onChange={this.changeDepartment.bind(this)}
                                options={toSelectOptions(departments)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Role</th>
                        <td>
                            <Select
                                name="respondent-department"
                                clearable={false}
                                value={respondent.role}
                                onChange={this.changeRole.bind(this)}
                                options={toSelectOptions(roles)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>;
    }
}
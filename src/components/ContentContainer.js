import React, { Component } from 'react';

import Achievements from './content/Achievements.js';
import Advertising from './content/Advertising.js';
import Archive from './content/Archive.js';
import ChartsController from './content/ChartsController';
import Exchange from './content/Exchange.js';
import HireWorkers from './content/HireWorkers';
import Loans from '../components/content/Loans.js';
import MarketTop from '../components/content/MarketTop.js';
import ProjectsFind from '../components/content/ProjectsFind.js';
import StartMeeting from '../components/content/StartMeeting.js';
import StartProject from '../components/content/StartProject.js';
import Welcome from '../components/content/Welcome.js';
import Mail from '../components/content/Mail.js';

const components = {
    'Achievements': Achievements,
    'Advertising': Advertising,
    'Archive': Archive,
    'ChartsController': ChartsController,
    'Exchange': Exchange,
    'HireWorkers': HireWorkers,
    'Loans': Loans,
    'MarketTop': MarketTop,
    'ProjectsFind': ProjectsFind,
    'StartMeeting': StartMeeting,
    'StartProject': StartProject,
    'Welcome': Welcome,
    'Mail': Mail
};


class ContentContainer extends Component {

    render() {
        const ContentComponent = components[this.props.data.content];

        return (
            <div className="card">
                <ContentComponent data={this.props.data} />
            </div>
        );
    }
}

export default ContentContainer;
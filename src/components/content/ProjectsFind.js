import React, { Component } from 'react';

import ProjectOfferBlock from '../ProjectOfferBlock';

import SalesAgency from '../SalesAgency';
import Bar from '../Bar';
import {colors} from "../../game/knowledge";

class ProjectsFind extends Component {

    render() {
        const data = this.props.data;
        let offered = (candidate) => { return <ProjectOfferBlock key={candidate.id} candidate={candidate} data={this.props.data} /> };
        const reputation_bar = [
            {
                name : 'Reputation',
                width : Math.min(100, data.reputation),
                color : colors.orange,
                value : Math.ceil((data.reputation)*100)/100,
                id: 'reputation'
            }
        ];


        return <div className="project-find">
            <h3 className="text-center">Find Projects</h3>

            <h4>
                Reputation
                <button 
                className="btn btn-info btn-xs" 
                onClick={() => { data.helpers.changeContent('PublicRelations'); }}
                >
                    Public relations
                </button>
            </h4>
            <div className="reputation card flexbox">
                <div className="card-body">
                    
                    <Bar className="reputation-bar progress-lg" bar_data={reputation_bar} />

                    <div>

                    </div>
                </div>
            </div>

            <h4>
                Offered Projects
                <SalesAgency data={this.props.data} />
            </h4>
            
            {this.props.data.offered_projects.map(offered)}

        </div>
    }
}

export default ProjectsFind;

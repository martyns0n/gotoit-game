import React, { Component } from "react";

/***
 * KILL THIS ASAP
 */

class StatsBar extends Component {
    // shouldComponentUpdate() {
    //   return false;
    // }
    componentDidMount() {
        console.info("StatsBar mounted");
    }

    render() {
        const stats = this.props.stats;

        return (
            <div className="flexbox text-center">
                {Object.keys(stats).map(stat => {
                    return (
                        <span key={stat}>
                            {stats[stat].name}:{" "}
                            <span>
                                {stats[stat].val}
                                {"  "}
                            </span>
                        </span>
                    );

                    // return <StatsProgressBar
                    // type={stats[stat].name}
                    // hideCheckbox={true}
                    // max_stat={data.max_stats_projects_offered}
                    // stats={stats[stat].val}
                    // worker={candidate}
                    // data={data}
                    // />
                })}
            </div>
        );
    }
}

export default StatsBar;

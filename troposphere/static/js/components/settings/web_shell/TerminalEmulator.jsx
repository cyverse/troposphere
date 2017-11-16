import _ from "underscore";
import React from "react";
import stores from "stores";
import TerminalOption from "components/settings/web_shell/TerminalOption";

export default React.createClass({
    displayName: "TerminalEmulator",

    getInitialState: function() {
        return {
            showTips: false,
        };
    },

    updateState: function() {
        this.setState(this.getInitialState());
    },

    showToggle: function() {
        this.setState({
            showTips: !this.state.showTips
        });
    },

    getDefaultProps: function() {
        return {
            options: {
                "default": "No persistence",
                tmux: "tmux",
                screen: "screen"
            }
         };
    },

    getQuickTips: function(type) {
        switch (type) {
            case "default":
                return(
                <div>
                    <a onClick={this.showToggle}>
                        <p>
                        This mode just uses the default bash terminal.
                        </p>
                    </a>
                </div>
                );
            case "tmux":
                return(
                <div>
                    <a onClick={this.showToggle}>
                        <h4>Tmux Quick Tips</h4>
                        <p>
                        Use the key combination "CTRL+b" before each of the following commands.
                        </p>
                        <pre>
                        s - list sessions <br/>
                        $ - rename current sessions <br/>
                        c - create new tab <br/>
                        w - list tabs <br/>
                        n - next tab <br/>
                        p - previous tab <br/>
                        , - name tab <br/>
                        & - kill tab <br/>
                        % - vertical split pane <br/>
                        " - horizontal split pane <br/>
                        x - kill pane <br/>
                        Arrow keys to move between panes <br/>
                        ] - enable viewing up <br/>
                        d - detach without closing session <br/>
                        </pre>
                    </a>
                    <sup><a target="_blank" href="https://gist.github.com/MohamedAlaa/2961058">Source of the Quick Tips</a></sup>
                </div>
                );
            case "screen":
                return(
                <div>
                    <a onClick={this.showToggle}>
                        <h4>GNU Screen Quick Tips</h4>
                        <p>
                        Use the key combination "CTRL+a" before each of the following commands.
                        </p>
                        <pre>
                        " - list tab <br/>
                        A - rename current tab <br/>
                        c - create new tab <br/>
                        S - horizontal split pane <br/>
                        | - vertical split pane <br/>
                        TAB - switch between panes <br/>
                        d - detach without closing session <br/>
                        </pre>
                    </a>
                    <sup><a target="_blank" href="https://wiki.archlinux.org/index.php/GNU_Screen">Source of the Quick Tips</a></sup>
                </div>
                );
        }
    },

    noQuickTips: function() {
        return <a className="hidden-quick-tips" onClick={this.showToggle}>
                   Show Tips
               </a>
    },

    handleSelect: function(e) {
        e.preventDefault();
        this.props.onSelect(e.target.value);
    },

    render: function() {
        var options = _.map(this.props.options, function(text, type) {
            return (
            <TerminalOption type={type} text={text} />
            );
        }.bind(this));

        return (
        <div>
            <form>
                <select id="terminal-select" value={this.props.selected} onChange={this.handleSelect}>
                    {options}
                </select>
            </form>
            {this.state.showTips ?
             this.getQuickTips(this.props.selected) :
             this.noQuickTips()}
        </div>
        );
    }
});

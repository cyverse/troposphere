import _ from "underscore";
import React from "react";
import stores from "stores";
import TerminalOption from "components/settings/web_shell/TerminalOption";

export default React.createClass({
    displayName: "TerminalEmulator",

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
                <p>
                This mode just uses the default bash terminal.
                </p>
                );
            case "tmux":
                return(
                <div>
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
                    <sup><a target="_blank" href="https://gist.github.com/MohamedAlaa/2961058">Source of the Quick Tips</a></sup>
                </div>
                );
            case "screen":
                return(
                <div>
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
                    <sup><a target="_blank" href="https://wiki.archlinux.org/index.php/GNU_Screen">Source of the Quick Tips</a></sup>
                </div>
                );
        }
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

        var tips = this.getQuickTips(this.props.selected);

        return (
        <div>
            <form>
                <select id="terminal-select" value={this.props.selected} onChange={this.handleSelect}>
                    {options}
                </select>
            </form>
            {tips}
        </div>
        );
    }
});

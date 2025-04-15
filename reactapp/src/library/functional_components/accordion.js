import React from 'react';

class Accordion extends React.Component {
    render() {
        const { name } = this.props;
        let clean_name = name
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
        if (this.props.index) {
            clean_name += `_${this.props.index}`;
        }

        return (
            <div class="accordion" id={`accordion${clean_name}`}>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            class={`accordion-button collapsed`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${clean_name}`}
                            aria-expanded="true"
                            aria-controls={`collapse${clean_name}`}
                        >
                            {name}
                        </button>
                    </h2>
                </div>

                <div
                    id={`collapse${clean_name}`}
                    class={`accordion-collapse collapse`}
                    data-bs-parent={`#accordionExample`}
                >
                    <div class="accordion-body">{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export default Accordion;

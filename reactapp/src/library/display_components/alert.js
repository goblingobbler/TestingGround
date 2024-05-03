export default function Alert(props) {
    let type = props.type ? props.type : 'success';

    return (
        <div
            style={props.style}
            className={`alert alert-${type} ${props.className}`}
        >
            {' '}
            {props.children}
        </div>
    );
}

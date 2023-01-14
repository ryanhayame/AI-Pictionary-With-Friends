import ClockLoader from "react-spinners/ClockLoader";

function Animation2() {
  
    return (
        <div className="sweet-loading">
            <ClockLoader
                color="#C7BCA1"
                loading="true"
                size={100}
                data-testid="loader"
            />
        </div>
    );
}
  
export default Animation2;
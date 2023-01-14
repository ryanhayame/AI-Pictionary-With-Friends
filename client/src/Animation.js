import BarLoader from "react-spinners/BarLoader";

function Animation() {
  
    return (
        <div className="sweet-loading">
            <BarLoader
                color="#C7BCA1"
                loading="true"
                height={4}
                width={700}
                data-testid="loader"
            />
        </div>
    );
}
  
export default Animation;
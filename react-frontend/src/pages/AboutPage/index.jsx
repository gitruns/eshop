import Navbar from "../../components/Navbar";

function AboutPage() {
    return (
        <>
            <Navbar />
            <div className="jumbotron text-center">
                <div className="display-4">About Us</div>
                <p className="lead">This is a simple about us page</p>
            </div>
            <div className="container">
                <section>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi ipsam quisquam eum. Rerum consequuntur excepturi tempora amet inventore exercitationem maxime quam pariatur error, laboriosam numquam labore optio, explicabo, animi illo.
                    </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non illo rerum architecto, ea, ex hic provident eveniet quo sapiente sit aspernatur accusamus libero molestias placeat adipisci aperiam nam saepe numquam.</p>
                </section>
            </div>
        </>
    )
}

export default AboutPage
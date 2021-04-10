import React, {Component} from 'react';
import './Specification.scss'
import StarRatings from "react-star-ratings";

class Specification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: "https://www.swiatobrazu.pl/zdjecie/artykuly/550890/wiewiorka.png",
            alt: "photo",
            average: 5.0,
            star: 1.0,
            name: "Nazwa salonu",
            street: "Owaka 4",
            city: "Wrocław",
            person: "Michałek",
            servicename: "Fryzjer damski",
            serviceprice: 60
        };
    }

    /* Sprawdza czy gwiazdka jest biała czy czerwona */
    CheckStar(){
        if (this.state.star === 1.0){
            return(
                <div className={'photo-star'}>
                    <button className={'btn'}>
                        <i className={'bi bi-star-fill star'} style={{color: "red"}}></i>
                    </button>
                </div>
            );
        }
        else {
            return(
                <div className={'photo-star'}>
                    <button className={'btn'}>
                        <i className={'bi bi-star-fill star'} style={{color: "white"}}></i>
                    </button>
                </div>
            );
        }
    }

    /* Funkcja dodaje zdjęcie z dodatkami */
    AddPhoto(){
        return(
            <div className="card bg-dark">
                <img className="card-img photo-container" src={this.state.source} alt={this.state.alt}/>
                <div className="card-img-overlay">
                    <div className={'photo-overlay-container-star'}>
                        {this.CheckStar()}
                    </div>

                    <div className={'photo-overlay-container-value'}>
                        <div className={'photo-value'}>
                            {this.state.average}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* Funkcja dodaje nazwę salonu */
    AddName(){
        return(
            <div className={'name-container'}>
                {this.state.name}
            </div>
        );
    }

    /* Funkcja dodaje adres salonu */
    AddAddress(){
        return(
            <div className={'address-container'}>
                ul. {this.state.street}, {this.state.city}
            </div>
        );
    }

    /* Funkcja dodaje blok z komentarzami */
    AddComments(){
        return(
            <div className="overflow-auto scrollbar" style={{height: '15vw'}}>

                <div className={'comment'}>
                    <div className={'comment-blank'} />
                    <div className={'comment-photo-container'}>
                        <img className="card-img comment-photo" src={this.state.source} alt={this.state.alt}/>
                    </div>
                    <div className={'comment-blank'} />
                    <div className={'comment-name-note-comment'}>
                        <div className={'comment-name-note'}>
                            <div className={'comment-name'}>
                                {this.state.person}
                            </div>
                            <div className={'comment-note'}>
                                <StarRatings
                                    rating={5}
                                    starDimension="2vw"
                                    starSpacing="15px"
                                />
                            </div>
                        </div>
                        <div className={'comment-comment'}>
                            Bardzo miły i przyjemny salon
                        </div>
                    </div>
                    <div className={'comment-blank'} />
                </div>

                <div className={'comment'}>
                    <div className={'comment-blank'} />
                    <div className={'comment-photo-container'}>
                        <img className="card-img comment-photo" src={this.state.source} alt={this.state.alt}/>
                    </div>
                    <div className={'comment-blank'} />
                    <div className={'comment-name-note-comment'}>
                        <div className={'comment-name-note'}>
                            <div className={'comment-name'}>
                                {this.state.person}
                            </div>
                            <div className={'comment-note'}>
                                <StarRatings
                                    rating={5}
                                    starDimension="2vw"
                                    starSpacing="15px"
                                />
                            </div>
                        </div>
                        <div className={'comment-comment'}>
                            Bardzo miły i przyjemny salon
                        </div>
                    </div>
                    <div className={'comment-blank'} />
                </div>

            </div>
        );
    }

    AddServices(){
        return(
            <div className="overflow-auto scrollbar" style={{height: '10vw'}}>

                <div className={'service-name-price-button'}>
                    <div className={'service-name'}>
                        {this.state.servicename}
                    </div>
                    <div className={'service-price-button'}>
                        <div className={'service-price'}>
                            {this.state.serviceprice} zł
                        </div>
                        <div className={'service-button'}>
                            <button className={'service-button-button'}>
                                Book
                            </button>
                        </div>
                    </div>
                </div>

                <div className={'service-name-price-button'}>
                    <div className={'service-name'}>
                        {this.state.servicename}
                    </div>
                    <div className={'service-price-button'}>
                        <div className={'service-price'}>
                            {this.state.serviceprice} zł
                        </div>
                        <div className={'service-button'}>
                            <button className={'service-button-button'}>
                                Book
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    render() {
        return (
            <div className={'base'}>
                {this.AddPhoto()}
                {this.AddName()}
                {this.AddAddress()}
                {this.AddComments()}
                {this.AddServices()}
            </div>
        );
    }
}

export default Specification;
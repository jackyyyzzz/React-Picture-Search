import React from 'react';
import unsplash from '../api/unsplash';
import SearchBar from './SearchBar';
import ImageList from './ImageList';
import SearchTabs from './SearchTabs';


class App extends React.Component {
    constructor() {
        super()
        this.terms = []
        this.loading = false
    }

    state = {
        activeTab: '',

        '': {
            images: [],
            pageNumber: 1
            }
        
    };
    
    onSearchSubmit = async searchTerm => {
        if (this.terms.includes(searchTerm)) {
            return
        }


        this.terms.push(searchTerm);
        const response = await unsplash.get('/search/photos', {
            params: { 
                query: this.terms[this.terms.length - 1],
                page: 1
            },
        });

        this.state[`${searchTerm}`] = { images: response.data.results, pageNumber: 1 };
        this.setState({activeTab: this.terms[this.terms.length - 1]})

        
    };

    onLastImageFound = lastImage => {
        let { activeTab } = this.state
        const observer = new IntersectionObserver(entries => {
            if (this.loading) return
            if (entries[0].isIntersecting) {
                this.loading = true
                unsplash.get('/search/photos', {
                    params: {
                        query: activeTab,
                        page: this.state[`${activeTab}`].pageNumber + 1
                    }
                }).then(response => {
                    const origImages = [...this.state[`${activeTab}`].images, ...response.data.results];
                    const images = origImages
                        .filter(image => origImages
                            .find(origImage => origImage.id === image.id && image !== origImage
                            ) === undefined
                    )
                    this.setState({ 
                        [`${activeTab}`] : {
                                images: images,
                                pageNumber: this.state[`${activeTab}`].pageNumber + 1 
                            }
                    });
                    this.loading = false
                    observer.disconnect()
                }).catch(e => {
                    console.log(e)
                    observer.disconnect()
                })
            }
        });

        observer.observe(lastImage);
    };
    

    setActiveTab = (e) => {
        this.setState({ activeTab: e.target.innerHTML });
    }
    
    render() {
        return (
            <div className="ui container" style={{ marginTop: '10px'}}>
                <SearchBar onSubmit={this.onSearchSubmit} />
                <SearchTabs
                    searches={this.terms} 
                    activeTab={this.state.activeTab} 
                    setActiveTab={this.setActiveTab} 
                    imageList={<ImageList 
                                    onLastImageFound={this.onLastImageFound} 
                                    images={this.state[`${this.state.activeTab}`].images}

                                    />}
                    />
                
                
            </div>
        );
    }
}

export default App;
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

        searchResults: {
                        '': {
                            images: [],
                            pageNumber: 1
                        }
            }
        
    };
    
    onSearchSubmit = async searchTerm => {
        searchTerm = searchTerm.toLowerCase();
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

        if (response.data.results.length === 0) {
            this.terms = this.terms.filter(term => term !== searchTerm)
            alert(`Sorry, no results found for ${searchTerm}`)
            return
        }


        this.state.searchResults[`${searchTerm}`] = { images: response.data.results, pageNumber: 1 };
        this.setState({activeTab: this.terms[this.terms.length - 1]})

        
    };

    onLastImageFound = lastImage => {
        let { activeTab, searchResults } = this.state
        const observer = new IntersectionObserver(entries => {
            if (this.loading) return
            if (entries[0].isIntersecting) {
                this.loading = true
                unsplash.get('/search/photos', {
                    params: {
                        query: activeTab,
                        page: searchResults[`${activeTab}`].pageNumber + 1
                    }
                }).then(response => {
                    const origImages = [...searchResults[`${activeTab}`].images, ...response.data.results];
                    const images = origImages
                        .filter(image => origImages
                            .find(origImage => origImage.id === image.id && image !== origImage
                            ) === undefined
                    )
                    const newResults = Object.assign({}, searchResults)
                    newResults[`${activeTab}`].images = images
                    newResults[`${activeTab}`].pageNumber += 1

                    this.setState({ searchResults: newResults });

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
        if (e.target.getAttribute('data-button-type') === 'close') return
        this.setState({ activeTab: e.target.getAttribute('data-search-term')});
    }

    closeTab = (e) => {
        const tabToClose = e.target.parentNode.getAttribute('data-search-term');

        const newResults = Object.assign({}, this.state.searchResults)
        delete newResults[`${tabToClose}`]
        this.setState({ searchResults: newResults });

        this.terms = this.terms.filter(term => term !== tabToClose)

        this.setState({ activeTab: this.terms[0] || '' });
    }
    
    render() {
        console.log(this.state)
        return (
            <div className="ui container" style={{ marginTop: '10px'}}>
                <SearchBar onSubmit={this.onSearchSubmit} />
                <SearchTabs
                    searches={this.terms} 
                    activeTab={this.state.activeTab} 
                    setActiveTab={this.setActiveTab} 
                    closeTab={this.closeTab}
                    imageList={<ImageList 
                                    onLastImageFound={this.onLastImageFound} 
                                    images={this.state.searchResults[`${this.state.activeTab}`].images}

                                    />}
                    />
                
                
            </div>
        );
    }
}

export default App;
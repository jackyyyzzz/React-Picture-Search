import React from 'react';
import unsplash from '../api/unsplash';
import SearchBar from './SearchBar';
import ImageList from './ImageList';
import SearchTabs from './SearchTabs';


class App extends React.Component {
    constructor() {
        super()
        this.term = []
        this.loading = false
    }

    state = {
        images: [],
        pageNumber: 1,
        activeTab: ''
    };
    
    onSearchSubmit = async term => {
        if (this.term.includes(term)) {
            return
        }
        this.term.push(term);
        const response = await unsplash.get('/search/photos', {
            params: { 
                query: this.term[this.term.length - 1],
                page: 1
            },
        });

        this.setState({ images: response.data.results, pageNumber: 1 });
        this.setState({activeTab: this.term[this.term.length - 1]})
    };

    onLastImageFound = lastImage => {
        const observer = new IntersectionObserver(entries => {
            if (this.loading) return
            if (entries[0].isIntersecting) {
                this.loading = true
                unsplash.get('/search/photos', {
                    params: {
                        query: this.term[this.term.length - 1],
                        page: this.state.pageNumber + 1
                    }
                }).then(response => {
                    const origImages = [...this.state.images, ...response.data.results];
                    const images = origImages
                        .filter(image => origImages
                            .find(origImage => origImage.id === image.id && image !== origImage
                            ) === undefined
                    )
                    this.setState({
                        images: images,
                        pageNumber: this.state.pageNumber + 1 
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
                    searches={this.term} 
                    activeTab={this.state.activeTab} 
                    setActiveTab={this.setActiveTab} 
                    imageList={<ImageList onLastImageFound={this.onLastImageFound} images={this.state.images}/>}
                    />
                
                
            </div>
        );
    }
}

export default App;
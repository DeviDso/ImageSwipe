var app = new Vue({
    el: '#app',
    data: {
        back: false,
        votes: true,
        ratings: false,
        card: true,
        over: false,
        images: [],
        image: [],
        rateText: '',
        current: 0,
        imageData: {
            'id': '',
            'vote': '',
            'rating': '',
        },
        votesCount: [],
        upVoteCount: 0,
        downVoteCount: 0,
    },
    mounted: function(){
        var app = this;

        axios.all([
            axios.get('api.php'),
            axios.get('ratings.json')
        ]).then(axios.spread(function(images, votes){
            app.images = images.data;
            app.image = images.data[0];
            app.votesCount = votes.data;

            for(var i = 0; i < votes.data.length; i++)
            {
                if(votes.data[i].id == images.data[0].id)
                {
                    (votes.data[i].vote == 1) ? app.upVoteCount++ : app.downVoteCount++;
                }
            }

        })).catch(function(err){
            console.log(err);
            alert('Failed to load');
        });
    },
    methods: {
        countVotes(){
            axios.get('ratings.json').then(function(votes)
            {
                app.votesCount = votes.data;
                console.log(votes.data);
            }).catch(function(err){
                console.log(err);
                alert('Failed to load');
            });

            this.upVoteCount = 0;
            this.downVoteCount = 0;

            for(var i = 0; i < this.votesCount.length; i++)
            {
                if(this.votesCount[i].id == this.image.id)
                {
                    (this.votesCount[i].vote == 1) ? this.upVoteCount++ : this.downVoteCount++;
                }
            }
        },
        next(choice){
            this.votes = false;
            this.ratings = true;
            this.imageData.id = this.image.id;
            this.imageData.vote = choice;
        },
        rating(choice){
            this.card = false;
            this.back = true;
            this.imageData.rating = choice;
            this.current++;
            if(this.current < this.images.length)
            {
                this.image = this.images[this.current];
                this.votes = true;
                this.ratings = false;
                setTimeout(() => this.card = true, 700);

                this.countVotes();
            }
            else {
                this.votes = true;
                this.ratings = false;
                this.over = true;
            }
            axios.post('api.php', this.imageData).then(function(res){
                //console.log(res);
            }).catch(function(err){
                console.log(err);
                alert('Failed to load');
            });
        },
        goBack(){
            this.over = false;
            var app = this;

            if(this.current > 0)
            {
                this.image = this.images[this.current-1];
                this.current--;
                if(this.current == 0)
                {
                    this.back = false;
                }
                this.over = false;
                this.card = true;

                this.countVotes();
            }
            else {
                alert('Not allowed');
            }
        }
    },
})

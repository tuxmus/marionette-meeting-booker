describe('Entities.Meeting', function() {
  describe('get() and set()', function() {
    it("returns the value set on the attribute", function() {
      var meeting = new MeetingBooker.Entities.Meeting();
      meeting.set('foo', 'bar');
      expect(meeting.get('foo')).to.be('bar');
    })
  });

  describe('interaction with localstorage', function() {
    var meeting;
    var meeting2;

    beforeEach(function() {
      meeting = new MeetingBooker.Entities.Meeting({id: 1, foo: 'bar'});
      meeting2 = new MeetingBooker.Entities.Meeting({id: 1});
    });

    it("saving and reading from the same model id works", function() {
      // return will tell Mocha to wait till the promise is resolved
      return meeting.save().then(function() {
        return meeting2.fetch();
      }).then(function() {
        expect(meeting2.get('foo')).to.be('bar');
      });
    });
  })
});


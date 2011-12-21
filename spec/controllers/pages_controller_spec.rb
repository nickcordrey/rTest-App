require 'spec_helper'

describe PagesController do

  describe "GET 'raphael'" do
    it "should be successful" do
      get 'raphael'
      response.should be_success
    end
  end

end

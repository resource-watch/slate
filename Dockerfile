FROM ruby:2.4.1-stretch
RUN apt-get update \
    && apt-get upgrade --yes \
    && apt-get install --yes \
    nodejs \
    && apt-get clean
ADD source /app/source
ADD Gemfile /app/Gemfile
ADD config.rb /app/config.rb
ADD Gemfile.lock /app/Gemfile.lock
RUN gem install --no-ri --no-rdoc bundler execjs
WORKDIR /app/source
RUN bundle install
EXPOSE 4567
CMD ["bundle", "exec", "middleman", "server"]

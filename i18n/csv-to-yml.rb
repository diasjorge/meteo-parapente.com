require 'csv'
require 'yaml'

locales = {}

CSV.foreach('i18n.csv', headers: true) do |row|
  locales[row['lang']] ||= {}
  locales[row['lang']][row['class']] ||= {}
  locales[row['lang']][row['class']][row['txt_id']] = row['txt']
end

locales.each do |lang, value|
  File.open("#{lang}.yml", 'w+') do |f|
    f << YAML.dump({lang => value})
  end
end
